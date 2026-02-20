"use client"
import React, { Suspense, useState, useEffect } from "react";
import FilterBar from "./components/FilterBar";
const CarCard = React.lazy(() => import("./components/CarCard"));
import type { CarCardProps } from "./components/CarCard";
import HeroSection from "./components/HeroSection";
import { CarService } from "./services/carService";
import CarDetailsPanel from "./components/CarDetailsPanel";

export default function Home() {
  const [cars, setCars] = useState<CarCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredCars, setFilteredCars] = useState<CarCardProps[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarCardProps | null>(null);

  // Track selected filter values
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");

  // Load cars from Supabase on component mount
  useEffect(() => {
    loadCars();
  }, []);

  // Apply all filters whenever cars or filter values change
  useEffect(() => {
    let filtered = [...cars];
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(car => car.type.toLowerCase() === selectedType.toLowerCase());
    }
    if (selectedPrice) {
      const maxPrice = parseInt(selectedPrice, 10);
      filtered = filtered.filter(car => {
        const price = typeof car.priceKsh === 'string' ? parseInt(car.priceKsh, 10) : car.priceKsh;
        return price <= maxPrice;
      });
    }
    setFilteredCars(filtered);
  }, [cars, selectedType, selectedPrice]);

  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const carsData = await CarService.getCars();
      setCars(carsData);
    } catch (err) {
      console.error('Error loading cars:', err);
      setError('Failed to load cars. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = async (value: string) => {
    try {
      let sortedCars: CarCardProps[];
      switch (value) {
        case 'price-low':
          sortedCars = await CarService.getCarsSortedByPrice(true);
          break;
        case 'price-high':
          sortedCars = await CarService.getCarsSortedByPrice(false);
          break;
        default:
          sortedCars = cars;
      }
      setFilteredCars(sortedCars);
    } catch (err) {
      console.error('Error sorting cars:', err);
    }
  };

  const handleVehicleTypeChange = (value: string) => setSelectedType(value);
  const handlePriceChange = (value: string) => setSelectedPrice(value);

  return (
    <main className="min-h-screen bg-[#fcfcfd] selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-400/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <HeroSection />

        <div id="fleet" className="w-full max-w-7xl mx-auto px-6 py-20 md:py-48">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8 animate-fade-in">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                Curated Collection
              </div>
              <h2 className="font-outfit font-black text-5xl md:text-7xl text-slate-900 mb-6 tracking-tighter leading-[0.9]">
                The Elite <br />
                <span className="text-blue-600">Inventory.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Exceptional quality. Rigorous inspection. Our collection represents the pinnacle of automotive excellence.
              </p>
            </div>
          </div>

          <FilterBar
            onSortChange={handleSortChange}
            onVehicleTypeChange={handleVehicleTypeChange}
            onPriceChange={handlePriceChange}
          />

          {/* Content Area */}
          <div className="min-h-[600px]">
            {loading && (
              <div className="flex flex-col items-center justify-center py-40 gap-8">
                <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin shadow-xl" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Inventory...</p>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto glass-panel border border-red-100/50 rounded-[3rem] p-12 text-center shadow-2xl">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 text-3xl font-black">
                  !
                </div>
                <h3 className="font-outfit font-black text-3xl text-slate-900 mb-4 tracking-tight">Technical Distruption</h3>
                <p className="text-slate-500 mb-10 font-medium leading-relaxed">{error}</p>
                <button
                  onClick={loadCars}
                  className="px-10 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl transition-all duration-500 shadow-xl"
                >
                  Reconnect
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                {filteredCars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {filteredCars.map((car, idx) => (
                      <div
                        key={car.id || idx}
                        className="animate-fade-in"
                        style={{ animationDelay: `${idx * 0.15}s` }}
                        onClick={() => setSelectedCar(car)}
                      >
                        <Suspense fallback={<div className="aspect-[3/2] bg-slate-100 rounded-[2rem] animate-pulse" />}>
                          <CarCard {...car} />
                        </Suspense>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel rounded-[3rem] p-20 text-center max-w-3xl mx-auto border-white/40 shadow-2xl">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
                      🏎️
                    </div>
                    <h3 className="font-outfit font-black text-4xl text-slate-900 mb-4 tracking-tighter">Inventory Search Failed</h3>
                    <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">
                      Your current criteria yielded no results. Our advisors are standing by to help you find your perfect match.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedType("");
                        setSelectedPrice("");
                        window.location.reload();
                      }}
                      className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all duration-500 shadow-2xl"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Premium Footer */}
        <footer className="glass-card mt-32 relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />
          <div className="absolute inset-0 bg-slate-900/95" />
          <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 text-center">
            <h2 className="font-outfit font-black text-5xl md:text-7xl mb-10 tracking-tighter">Ready for <span className="text-blue-500">Excellence?</span></h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12 font-medium">Experience the ultimate in automotive luxury and performance. Your journey starts here.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all duration-500 shadow-2xl hover:-translate-y-1">
                Contact Concierge
              </button>
              <button className="px-12 py-5 bg-transparent border border-white/20 text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all duration-500 backdrop-blur-md">
                Schedule Viewing
              </button>
            </div>

            <div className="mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="font-outfit font-black text-2xl">NOCARCONTEXT<span className="text-blue-600">.</span></div>
              <div className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">© 2026 Nocarcontext. All Rights Reserved.</div>
            </div>
          </div>
        </footer>
      </div>

      {selectedCar && (
        <CarDetailsPanel car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </main>
  );
}
