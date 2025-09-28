import React, { useState } from 'react';
import { X, Search, Upload } from 'lucide-react';

const MaterialIconSelector = ({
  selectedIcon,
  onIconSelect,
  onFileUpload,
  categoryType = 'general',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadOption, setShowUploadOption] = useState(false);

  // Material Icons organized by categories
  const materialIcons = {
    income: [
      { name: 'attach_money', displayName: 'Attach Money', keywords: ['money', 'dollar', 'currency', 'cash'] },
      { name: 'account_balance', displayName: 'Account Balance', keywords: ['bank', 'balance', 'account', 'financial'] },
      { name: 'credit_card', displayName: 'Credit Card', keywords: ['credit', 'card', 'payment', 'banking'] },
      { name: 'savings', displayName: 'Savings', keywords: ['savings', 'money', 'piggy', 'bank'] },
      { name: 'trending_up', displayName: 'Trending Up', keywords: ['trending', 'growth', 'increase', 'chart'] },
      { name: 'work', displayName: 'Work', keywords: ['work', 'job', 'business', 'professional'] },
      { name: 'business', displayName: 'Business', keywords: ['business', 'company', 'corporate', 'office'] },
      { name: 'account_balance_wallet', displayName: 'Wallet', keywords: ['wallet', 'money', 'purse', 'finance'] },
      { name: 'monetization_on', displayName: 'Monetization', keywords: ['money', 'monetization', 'revenue', 'income'] },
      { name: 'payments', displayName: 'Payments', keywords: ['payments', 'money', 'transaction', 'payment'] },
      { name: 'receipt', displayName: 'Receipt', keywords: ['receipt', 'invoice', 'bill', 'document'] },
      { name: 'request_quote', displayName: 'Request Quote', keywords: ['quote', 'estimate', 'price', 'cost'] },
      { name: 'sell', displayName: 'Sell', keywords: ['sell', 'sale', 'commerce', 'trade'] },
      { name: 'store', displayName: 'Store', keywords: ['store', 'shop', 'retail', 'commerce'] },
      { name: 'local_atm', displayName: 'ATM', keywords: ['atm', 'cash', 'money', 'withdrawal'] },
      { name: 'card_giftcard', displayName: 'Gift Card', keywords: ['gift', 'card', 'present', 'reward'] },
      { name: 'redeem', displayName: 'Redeem', keywords: ['redeem', 'reward', 'gift', 'bonus'] },
      { name: 'stars', displayName: 'Stars', keywords: ['stars', 'rating', 'favorite', 'premium'] },
      { name: 'emoji_events', displayName: 'Events', keywords: ['events', 'trophy', 'achievement', 'success'] },
      { name: 'trending_flat', displayName: 'Stable Income', keywords: ['stable', 'consistent', 'regular', 'steady'] },
      { name: 'show_chart', displayName: 'Chart', keywords: ['chart', 'graph', 'analytics', 'data'] },
      { name: 'bar_chart', displayName: 'Bar Chart', keywords: ['bar', 'chart', 'statistics', 'data'] },
      { name: 'pie_chart', displayName: 'Pie Chart', keywords: ['pie', 'chart', 'percentage', 'distribution'] },
      { name: 'assessment', displayName: 'Assessment', keywords: ['assessment', 'evaluation', 'analysis', 'report'] },
      { name: 'analytics', displayName: 'Analytics', keywords: ['analytics', 'data', 'insights', 'metrics'] },
      { name: 'account_tree', displayName: 'Account Tree', keywords: ['account', 'tree', 'hierarchy', 'structure'] },
      { name: 'account_circle', displayName: 'Account Circle', keywords: ['account', 'user', 'profile', 'person'] },
      { name: 'person', displayName: 'Person', keywords: ['person', 'user', 'individual', 'profile'] },
      { name: 'group', displayName: 'Group', keywords: ['group', 'team', 'people', 'collective'] },
      { name: 'handshake', displayName: 'Handshake', keywords: ['handshake', 'deal', 'agreement', 'partnership'] },
      { name: 'diamond', displayName: 'Diamond', keywords: ['diamond', 'premium', 'luxury', 'valuable'] },
      { name: 'currency_exchange', displayName: 'Currency Exchange', keywords: ['currency', 'exchange', 'forex', 'conversion'] },
      { name: 'savings_account', displayName: 'Savings Account', keywords: ['savings', 'account', 'deposit', 'bank'] },
      { name: 'investment', displayName: 'Investment', keywords: ['investment', 'portfolio', 'stocks', 'bonds'] },
      { name: 'trending_down', displayName: 'Trending Down', keywords: ['trending', 'decrease', 'decline', 'loss'] },
      { name: 'timeline', displayName: 'Timeline', keywords: ['timeline', 'schedule', 'calendar', 'time'] },
      { name: 'schedule', displayName: 'Schedule', keywords: ['schedule', 'time', 'calendar', 'appointment'] },
      { name: 'event', displayName: 'Event', keywords: ['event', 'occasion', 'meeting', 'gathering'] },
      { name: 'campaign', displayName: 'Campaign', keywords: ['campaign', 'marketing', 'promotion', 'advertising'] },
      { name: 'volunteer_activism', displayName: 'Volunteer', keywords: ['volunteer', 'charity', 'donation', 'help'] },
      { name: 'psychology', displayName: 'Psychology', keywords: ['psychology', 'mental', 'health', 'wellness'] },
      { name: 'school', displayName: 'Education', keywords: ['education', 'school', 'learning', 'study'] },
      { name: 'auto_awesome', displayName: 'Auto Awesome', keywords: ['awesome', 'magic', 'automatic', 'smart'] }
    ],
    expense: [
      { name: 'shopping_cart', displayName: 'Shopping Cart', keywords: ['shopping', 'cart', 'buy', 'purchase'] },
      { name: 'restaurant', displayName: 'Restaurant', keywords: ['restaurant', 'food', 'dining', 'meal'] },
      { name: 'local_gas_station', displayName: 'Gas Station', keywords: ['gas', 'fuel', 'petrol', 'station'] },
      { name: 'directions_car', displayName: 'Car', keywords: ['car', 'vehicle', 'transport', 'automobile'] },
      { name: 'home', displayName: 'Home', keywords: ['home', 'house', 'residence', 'property'] },
      { name: 'electric_bolt', displayName: 'Electricity', keywords: ['electricity', 'power', 'energy', 'electric'] },
      { name: 'water_drop', displayName: 'Water', keywords: ['water', 'utility', 'bill', 'service'] },
      { name: 'wifi', displayName: 'WiFi', keywords: ['wifi', 'internet', 'connection', 'network'] },
      { name: 'phone', displayName: 'Phone', keywords: ['phone', 'mobile', 'communication', 'call'] },
      { name: 'medical_services', displayName: 'Medical', keywords: ['medical', 'health', 'doctor', 'hospital'] },
      { name: 'school', displayName: 'Education', keywords: ['education', 'school', 'learning', 'study'] },
      { name: 'fitness_center', displayName: 'Fitness', keywords: ['fitness', 'gym', 'exercise', 'health'] },
      { name: 'movie', displayName: 'Entertainment', keywords: ['movie', 'entertainment', 'cinema', 'film'] },
      { name: 'music_note', displayName: 'Music', keywords: ['music', 'audio', 'sound', 'entertainment'] },
      { name: 'sports_esports', displayName: 'Gaming', keywords: ['gaming', 'games', 'esports', 'entertainment'] },
      { name: 'flight', displayName: 'Travel', keywords: ['travel', 'flight', 'trip', 'vacation'] },
      { name: 'hotel', displayName: 'Hotel', keywords: ['hotel', 'accommodation', 'travel', 'stay'] },
      { name: 'local_taxi', displayName: 'Taxi', keywords: ['taxi', 'transport', 'ride', 'cab'] },
      { name: 'train', displayName: 'Train', keywords: ['train', 'transport', 'railway', 'commute'] },
      { name: 'directions_bus', displayName: 'Bus', keywords: ['bus', 'transport', 'public', 'commute'] },
      { name: 'shopping_bag', displayName: 'Shopping Bag', keywords: ['shopping', 'bag', 'retail', 'purchase'] },
      { name: 'local_grocery_store', displayName: 'Grocery Store', keywords: ['grocery', 'food', 'supermarket', 'shopping'] },
      { name: 'local_pharmacy', displayName: 'Pharmacy', keywords: ['pharmacy', 'medicine', 'drugs', 'health'] },
      { name: 'local_hospital', displayName: 'Hospital', keywords: ['hospital', 'medical', 'health', 'emergency'] },
      { name: 'local_parking', displayName: 'Parking', keywords: ['parking', 'garage', 'vehicle', 'space'] },
      { name: 'local_laundry_service', displayName: 'Laundry', keywords: ['laundry', 'washing', 'cleaning', 'service'] },
      { name: 'local_post_office', displayName: 'Post Office', keywords: ['post', 'mail', 'shipping', 'package'] },
      { name: 'local_shipping', displayName: 'Shipping', keywords: ['shipping', 'delivery', 'package', 'logistics'] },
      { name: 'local_offer', displayName: 'Offer', keywords: ['offer', 'discount', 'deal', 'promotion'] },
      { name: 'local_activity', displayName: 'Activity', keywords: ['activity', 'event', 'entertainment', 'fun'] },
      { name: 'local_see', displayName: 'See', keywords: ['see', 'view', 'sightseeing', 'tourism'] },
      { name: 'local_dining', displayName: 'Dining', keywords: ['dining', 'food', 'restaurant', 'meal'] },
      { name: 'local_cafe', displayName: 'Cafe', keywords: ['cafe', 'coffee', 'drink', 'beverage'] },
      { name: 'local_bar', displayName: 'Bar', keywords: ['bar', 'drink', 'alcohol', 'nightlife'] },
      { name: 'local_movies', displayName: 'Movies', keywords: ['movies', 'cinema', 'film', 'entertainment'] },
      { name: 'local_library', displayName: 'Library', keywords: ['library', 'books', 'reading', 'education'] },
      { name: 'local_mall', displayName: 'Mall', keywords: ['mall', 'shopping', 'retail', 'center'] },
      { name: 'local_convenience_store', displayName: 'Convenience Store', keywords: ['convenience', 'store', 'quick', 'shop'] },
      { name: 'local_florist', displayName: 'Florist', keywords: ['florist', 'flowers', 'plants', 'garden'] },
      { name: 'local_printshop', displayName: 'Print Shop', keywords: ['print', 'copy', 'document', 'office'] },
      { name: 'local_taxi', displayName: 'Taxi Service', keywords: ['taxi', 'ride', 'transport', 'service'] },
      { name: 'local_airport', displayName: 'Airport', keywords: ['airport', 'flight', 'travel', 'terminal'] },
      { name: 'local_attraction', displayName: 'Attraction', keywords: ['attraction', 'tourist', 'sightseeing', 'place'] },
      { name: 'local_play', displayName: 'Play', keywords: ['play', 'theater', 'show', 'entertainment'] },
      { name: 'local_hotel', displayName: 'Hotel', keywords: ['hotel', 'accommodation', 'stay', 'travel'] },
      { name: 'local_gas_station', displayName: 'Gas Station', keywords: ['gas', 'fuel', 'station', 'vehicle'] },
      { name: 'local_car_wash', displayName: 'Car Wash', keywords: ['car', 'wash', 'cleaning', 'vehicle'] },
      { name: 'local_repair_service', displayName: 'Repair Service', keywords: ['repair', 'fix', 'service', 'maintenance'] },
      { name: 'local_fire_department', displayName: 'Fire Department', keywords: ['fire', 'emergency', 'safety', 'department'] },
      { name: 'local_police', displayName: 'Police', keywords: ['police', 'security', 'law', 'enforcement'] },
      { name: 'local_hospital', displayName: 'Hospital', keywords: ['hospital', 'medical', 'health', 'emergency'] },
      { name: 'local_pharmacy', displayName: 'Pharmacy', keywords: ['pharmacy', 'medicine', 'drugs', 'health'] },
      { name: 'local_drink', displayName: 'Drink', keywords: ['drink', 'beverage', 'liquid', 'refreshment'] },
      { name: 'local_pizza', displayName: 'Pizza', keywords: ['pizza', 'food', 'italian', 'meal'] }
    ]
  };

  // Get icons based on category type
  const getIconsForCategory = () => {
    if (categoryType === 'income') return materialIcons.income;
    if (categoryType === 'expense') return materialIcons.expense;
    return materialIcons.general;
  };

  // Filter icons based on search term
  const filteredIcons = getIconsForCategory().filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
      setShowUploadOption(false);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Material Icon</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadOption(!showUploadOption)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title="Upload custom icon"
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>

      {/* Custom Upload Option */}
      {showUploadOption && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-3">Upload a custom icon</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="custom-icon-upload"
            />
            <label
              htmlFor="custom-icon-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Upload size={16} />
              Choose File
            </label>
            <button
              onClick={() => setShowUploadOption(false)}
              className="ml-2 px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Icon Grid */}
      <div className="max-h-64 overflow-y-auto">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {filteredIcons.map((icon, index) => (
            <button
              key={index}
              onClick={() => onIconSelect(icon.name)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center justify-center ${selectedIcon === icon.name
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              title={icon.displayName}
            >
              <span className="material-icons text-2xl text-gray-700 mb-1">
                {icon.name}
              </span>
              <span className="text-xs text-gray-600 text-center leading-tight">
                {icon.displayName}
              </span>
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No icons found matching your search.</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Click on any Material Icon to select it, or upload your own custom icon.
          Icons help users quickly identify categories.
        </p>
      </div>
    </div>
  );
};

export default MaterialIconSelector;
