// Database Service - Completely abstracted database operations
// No service provider names or references in this file

class DatabaseService {
    constructor() {
        this.isInitialized = false;
        this.client = null;
        this.initPromise = null;
    }

    async initialize() {
        if (this.isInitialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = this._doInitialize();
        return this.initPromise;
    }

    async _doInitialize() {
        try {
            // Import the remote database client library
            if (typeof window !== 'undefined') {
                // Browser environment - load from CDN
                if (!window.supabase) {
                    await this._loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
                }
                this.client = window.supabase.createClient(DB_CONFIG.url, DB_CONFIG.key);
            } else {
                // Node.js environment
                const { createClient } = require('@supabase/supabase-js');
                this.client = createClient(DB_CONFIG.url, DB_CONFIG.key);
            }
            
            this.isInitialized = true;
            console.log('Database connection established successfully');
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw new Error('Failed to connect to database');
        }
    }

    _loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async getAllNews() {
        await this.initialize();
        
        try {
            const { data, error } = await this.client
                .from(TABLE_NAME)
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            
            console.log('News fetched successfully:', data?.length || 0, 'items');
            return data || [];
        } catch (error) {
            console.error('Error fetching news:', error);
            throw new Error('Failed to fetch news from database');
        }
    }

    async addNews(newsItem) {
        await this.initialize();
        
        try {
            // Prepare data for database
            const dbData = {
                title: newsItem.title,
                mainText: newsItem.mainText, 
                date: newsItem.date,
                image: newsItem.image || 'assets/mthani1.jpg'
            };

            const { data, error } = await this.client
                .from(TABLE_NAME)
                .insert([dbData])
                .select();

            if (error) throw error;
            
            console.log('News added successfully:', data?.[0]);
            return data?.[0];
        } catch (error) {
            console.error('Error adding news:', error);
            throw new Error('Failed to add news to database');
        }
    }

    async updateNews(id, newsItem) {
        await this.initialize();
        
        try {
            const dbData = {
                title: newsItem.title,
                mainText: newsItem.mainText,
                date: newsItem.date,
                image: newsItem.image || 'assets/mthani1.jpg'
            };

            const { data, error } = await this.client
                .from(TABLE_NAME)
                .update(dbData)
                .eq('id', id)
                .select();

            if (error) throw error;
            
            console.log('News updated successfully:', data?.[0]);
            return data?.[0];
        } catch (error) {
            console.error('Error updating news:', error);
            throw new Error('Failed to update news in database');
        }
    }

    async deleteNews(id) {
        await this.initialize();
        
        try {
            const { error } = await this.client
                .from(TABLE_NAME)
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            console.log('News deleted successfully, ID:', id);
            return true;
        } catch (error) {
            console.error('Error deleting news:', error);
            throw new Error('Failed to delete news from database');
        }
    }

    async deleteAllNews() {
        await this.initialize();
        
        try {
            const { error } = await this.client
                .from(TABLE_NAME)
                .delete()
                .neq('id', 0); // Delete all records

            if (error) throw error;
            
            console.log('All news deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting all news:', error);
            throw new Error('Failed to delete all news from database');
        }
    }

    // ========== CAROUSEL IMAGE MANAGEMENT METHODS ==========
    async getAllCarouselImages() {
        await this.initialize();
        
        try {
            const { data, error } = await this.client
                .from('carousel_images')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            
            console.log('Carousel images fetched successfully:', data?.length || 0, 'items');
            return data || [];
        } catch (error) {
            console.error('Error fetching carousel images:', error);
            throw new Error('Failed to fetch carousel images from database');
        }
    }

    async addCarouselImage(imageData) {
        await this.initialize();
        
        try {
            const dbData = {
                image_url: imageData.image_url,
                alt_text: imageData.alt_text || '',
                sort_order: imageData.sort_order || 0,
                is_active: imageData.is_active !== false
            };

            const { data, error } = await this.client
                .from('carousel_images')
                .insert([dbData])
                .select();

            if (error) throw error;
            
            console.log('Carousel image added successfully:', data?.[0]);
            return data?.[0];
        } catch (error) {
            console.error('Error adding carousel image:', error);
            throw new Error('Failed to add carousel image to database');
        }
    }

    async updateCarouselImage(id, imageData) {
        await this.initialize();
        
        try {
            const dbData = {
                alt_text: imageData.alt_text || '',
                sort_order: imageData.sort_order || 0,
                is_active: imageData.is_active !== false
            };

            if (imageData.image_url) {
                dbData.image_url = imageData.image_url;
            }

            const { data, error } = await this.client
                .from('carousel_images')
                .update(dbData)
                .eq('id', id)
                .select();

            if (error) throw error;
            
            console.log('Carousel image updated successfully:', data?.[0]);
            return data?.[0];
        } catch (error) {
            console.error('Error updating carousel image:', error);
            throw new Error('Failed to update carousel image in database');
        }
    }

    async deleteCarouselImage(id) {
        await this.initialize();
        
        try {
            const { error } = await this.client
                .from('carousel_images')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            console.log('Carousel image deleted successfully, ID:', id);
            return true;
        } catch (error) {
            console.error('Error deleting carousel image:', error);
            throw new Error('Failed to delete carousel image from database');
        }
    }

    async testConnection() {
        await this.initialize();
        
        try {
            const { data, error } = await this.client
                .from(TABLE_NAME)
                .select('count', { count: 'exact', head: true });

            if (error) throw error;
            
            console.log('Database connection test successful');
            return true;
        } catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    }
}

// Create a singleton instance
const databaseService = new DatabaseService();

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = databaseService;
} else {
    window.databaseService = databaseService;
} 