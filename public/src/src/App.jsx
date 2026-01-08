#!/bin/bash

# Business Address Book - Automated Setup Script
# This script creates all necessary files and folders for the project

echo "🚀 Creating Business Address Book project..."

# Create project directory
PROJECT_DIR="business-address-book"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Create folder structure
echo "📁 Creating folder structure..."
mkdir -p public src

# Create package.json
echo "📦 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "business-address-book",
  "version": "1.0.0",
  "description": "A React application for organizing business contacts by geographic location",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "keywords": [
    "address-book",
    "contacts",
    "business",
    "react",
    "geographic-organization"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

# Create public/index.html
echo "📄 Creating public/index.html..."
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Business Address Book - Organize contacts by geographic location"
    />
    <title>Business Address Book</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create src/index.js
echo "📄 Creating src/index.js..."
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# Create src/App.jsx
echo "📄 Creating src/App.jsx..."
cat > src/App.jsx << 'EOF'
import React, { useState } from 'react';
import { Plus, Search, MapPin, Phone, Mail, StickyNote, Edit2, Trash2, X, Save } from 'lucide-react';

export default function App() {
  const [locations, setLocations] = useState([
    {
      id: 1,
      state: 'California',
      city: 'San Francisco',
      locality: 'Financial District',
      contacts: [
        {
          id: 1,
          name: 'John Smith',
          company: 'Tech Solutions Inc.',
          phone: '(415) 555-0123',
          email: 'john.smith@techsolutions.com',
          notes: 'Preferred vendor for IT services. Call before 3 PM.'
        }
      ]
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [newLocation, setNewLocation] = useState({ state: '', city: '', locality: '' });
  const [newContact, setNewContact] = useState({ 
    name: '', 
    company: '', 
    phone: '', 
    email: '', 
    notes: '',
    locationId: null 
  });

  const addLocation = () => {
    if (newLocation.state && newLocation.city) {
      setLocations([...locations, {
        id: Date.now(),
        ...newLocation,
        contacts: []
      }]);
      setNewLocation({ state: '', city: '', locality: '' });
      setShowAddLocation(false);
    }
  };

  const addContact = (locationId) => {
    if (newContact.name && newContact.locationId === locationId) {
      setLocations(locations.map(loc => 
        loc.id === locationId 
          ? { ...loc, contacts: [...loc.contacts, { ...newContact, id: Date.now() }] }
          : loc
      ));
      setNewContact({ name: '', company: '', phone: '', email: '', notes: '', locationId: null });
    }
  };

  const deleteLocation = (locationId) => {
    setLocations(locations.filter(loc => loc.id !== locationId));
  };

  const deleteContact = (locationId, contactId) => {
    setLocations(locations.map(loc => 
      loc.id === locationId 
        ? { ...loc, contacts: loc.contacts.filter(c => c.id !== contactId) }
        : loc
    ));
  };

  const updateContact = (locationId, contactId, updatedContact) => {
    setLocations(locations.map(loc => 
      loc.id === locationId 
        ? { ...loc, contacts: loc.contacts.map(c => c.id === contactId ? { ...c, ...updatedContact } : c) }
        : loc
    ));
    setEditingContact(null);
  };

  const filteredLocations = locations.filter(loc => {
    const searchLower = searchTerm.toLowerCase();
    const locationMatch = loc.state.toLowerCase().includes(searchLower) || 
                         loc.city.toLowerCase().includes(searchLower) ||
                         loc.locality.toLowerCase().includes(searchLower);
    const contactMatch = loc.contacts.some(c => 
      c.name.toLowerCase().includes(searchLower) ||
      c.company.toLowerCase().includes(searchLower)
    );
    return locationMatch || contactMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Business Address Book</h1>
          <p className="text-slate-600 mb-4">Organize contacts by geographic location</p>
          
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search locations or contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => setShowAddLocation(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Location
            </button>
          </div>
        </div>

        {showAddLocation && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">New Location</h2>
              <button onClick={() => setShowAddLocation(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="State *"
                value={newLocation.state}
                onChange={(e) => setNewLocation({...newLocation, state: e.target.value})}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="City *"
                value={newLocation.city}
                onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Locality (optional)"
                value={newLocation.locality}
                onChange={(e) => setNewLocation({...newLocation, locality: e.target.value})}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={addLocation}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Location
            </button>
          </div>
        )}

        <div className="space-y-6">
          {filteredLocations.map(location => (
            <div key={location.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin size={24} />
                  <div>
                    <h2 className="text-xl font-semibold">{location.city}, {location.state}</h2>
                    {location.locality && <p className="text-blue-100 text-sm">{location.locality}</p>}
                  </div>
                </div>
                <button
                  onClick={() => deleteLocation(location.id)}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="p-6">
                {location.contacts.map(contact => (
                  <div key={contact.id} className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    {editingContact?.id === contact.id && editingContact?.locationId === location.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingContact.name}
                          onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={editingContact.company}
                          onChange={(e) => setEditingContact({...editingContact, company: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Company"
                        />
                        <input
                          type="text"
                          value={editingContact.phone}
                          onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Phone"
                        />
                        <input
                          type="email"
                          value={editingContact.email}
                          onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Email"
                        />
                        <textarea
                          value={editingContact.notes}
                          onChange={(e) => setEditingContact({...editingContact, notes: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Notes"
                          rows="2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateContact(location.id, contact.id, editingContact)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <Save size={16} />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingContact(null)}
                            className="bg-slate-400 hover:bg-slate-500 text-white px-4 py-2 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800">{contact.name}</h3>
                            {contact.company && <p className="text-slate-600">{contact.company}</p>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingContact({...contact, locationId: location.id})}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => deleteContact(location.id, contact.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-slate-700">
                              <Phone size={16} className="text-slate-500" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center gap-2 text-slate-700">
                              <Mail size={16} className="text-slate-500" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                          {contact.notes && (
                            <div className="flex items-start gap-2 text-slate-700 mt-2 pt-2 border-t border-slate-200">
                              <StickyNote size={16} className="text-slate-500 mt-1" />
                              <span className="text-sm">{contact.notes}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {newContact.locationId === location.id ? (
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-3">
                    <input
                      type="text"
                      placeholder="Name *"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={newContact.company}
                      onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Notes"
                      value={newContact.notes}
                      onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => addContact(location.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Add Contact
                      </button>
                      <button
                        onClick={() => setNewContact({ name: '', company: '', phone: '', email: '', notes: '', locationId: null })}
                        className="bg-slate-400 hover:bg-slate-500 text-white px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setNewContact({...newContact, locationId: location.id})}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Contact
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No locations found</h3>
            <p className="text-slate-500">Add a location to get started organizing your business contacts</p>
          </div>
        )}
      </div>
    </div>
  );
}
EOF

# Create .gitignore
echo "📄 Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
EOF

# Create README.md
echo "📄 Creating README.md..."
cat > README.md << 'EOF'
# Business Address Book

A modern React application for organizing business contacts by geographic location. Easily manage contacts with detailed information including phone numbers, emails, and special notes.

## Features

- **Geographic Organization**: Organize contacts by State, City, and Locality
- **Contact Management**: Store name, company, phone, email, and custom notes
- **Search Functionality**: Quick search across locations and contacts
- **Edit & Delete**: Full CRUD operations for locations and contacts
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/business-address-book.git
cd business-address-book
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding a Location
1. Click the "Add Location" button
2. Enter State and City (required), and Locality (optional)
3. Click "Add Location" to save

### Adding a Contact
1. Navigate to a location card
2. Click "Add Contact" at the bottom of the location
3. Fill in contact details (Name is required)
4. Click "Add Contact" to save

### Editing Contacts
- Click the edit icon (pencil) next to any contact
- Modify the information
- Click "Save" to update

### Searching
- Use the search bar at the top to find locations or contacts
- Search works across all fields

## Technologies Used

- React 18
- Tailwind CSS
- Lucide React (icons)
- Create React App

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
EOF

# Create LICENSE
echo "📄 Creating LICENSE..."
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

echo ""
echo "✅ Project setup complete!"
echo ""
echo "📍 Project created in: $PROJECT_DIR"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_DIR"
echo "2. npm install"
echo "3. npm start (to test locally)"
echo ""
echo "To upload to GitHub:"
echo "1. Create a new repository on GitHub"
echo "2. Run these commands:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/yourusername/business-address-book.git"
echo "   git push -u origin main"
echo ""
echo "🎉 Happy coding!"
