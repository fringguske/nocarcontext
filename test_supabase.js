
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mpqznwazguinlxlnkrng.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZXV0c3Z2Y2xxdWRzd3hxZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjE0MTUsImV4cCI6MjA4NjE5NzQxNX0.5-U1DubgDuqhbKbQE314IYbEeeD_me8Xf3KdnSZfLF4';

console.log('Testing Supabase connection...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Supabase Error:', error);
        } else {
            console.log('Supabase Data:', data);
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
    }
}

testConnection();

async function testInternet() {
    try {
        const res = await fetch('https://www.google.com');
        console.log('Google fetch status:', res.status);
    } catch (err) {
        console.error('Google fetch error:', err);
    }
}

testInternet();
