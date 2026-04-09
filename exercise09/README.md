# Exercise 09 - Database-Backed Data Management System

## Overview
This is an enhanced version of Exercise 07 that stores all data in a **MySQL database** instead of localStorage. This is a full-stack web application with a PHP backend and AJAX frontend.

## Architecture
```
Frontend (HTML/CSS/JavaScript with AJAX)
    ↓
PHP REST API Layer (7 endpoints)
    ↓
MySQL Database (submissions table)
```

## 📋 Features
- ✅ Form submission with server-side validation
- ✅ Store data in MySQL database
- ✅ Display records in dynamic table
- ✅ Delete individual records
- ✅ Clear all records with confirmation
- ✅ Download CSV export from database
- ✅ Copy table data to clipboard (TSV format)
- ✅ Real-time stats (record count, last updated)
- ✅ Toast notifications for all actions
- ✅ Responsive design (mobile-friendly)

## 🛠️ Setup Instructions

### 1. Database Setup
1. Open **phpMyAdmin** (via XAMPP, WAMP, or MAMP)
2. Create a new database named `exercise_09_db`
3. Run the SQL script from `database-setup.sql`:
   - Copy all SQL from the file
   - Paste into phpMyAdmin SQL tab
   - Click "Go"
   
**OR** use MySQL command line:
```bash
mysql -u root -p < database-setup.sql
```

### 2. Update Database Credentials
Edit `api/config.php` and update these variables if needed:
```php
$db_host = 'localhost';    // Usually 'localhost'
$db_user = 'root';         // Your MySQL username
$db_password = '';         // Your MySQL password (empty by default)
$db_name = 'exercise_09_db'; // Database name
```

### 3. Start a Web Server
You have several options:

**Option A: PHP Built-in Server** (Easiest)
```bash
cd /Users/sahashradhkm/Downloads/html\ css\ project/exercise\ 09
php -S localhost:8000
```
Then open: `http://localhost:8000`

**Option B: XAMPP/WAMP**
1. Place the `exercise 09` folder in `htdocs` (XAMPP) or `www` (WAMP)
2. Start Apache and MySQL
3. Open: `http://localhost/exercise%2009/` or `http://localhost/exercise%2009`

**Option C: Use existing web server**
- Move files to your web server's document root
- Update paths in `api/config.php` if needed

## 📁 File Structure
```
exercise 09/
  ├── index.html              (Main page - HTML structure)
  ├── style.css              (Styling - green theme)
  ├── script.js              (Frontend - AJAX calls)
  ├── database-setup.sql     (Database creation script)
  ├── README.md              (This file)
  └── api/
      ├── config.php         (Database connection)
      ├── submit.php         (POST - Insert form data)
      ├── fetch.php          (GET - Retrieve all records)
      ├── delete.php         (POST - Delete single record)
      ├── clear.php          (POST - Delete all records)
      ├── download.php       (GET - Export CSV)
      └── copy.php           (GET - Export TSV for clipboard)
```

## 🚀 Usage

1. **Submit Form**: Fill the form with your information and click "Submit & Store Data"
2. **View Records**: All submitted data appears in the table below
3. **Delete Record**: Click "Delete" button on any row to remove it
4. **Download CSV**: Click "Download CSV" to export all data as spreadsheet file
5. **Copy to Clipboard**: Click "Copy to Clipboard" to copy table data (paste in Excel/Sheets)
6. **Clear All**: Click "Clear All Data" to delete all records (confirmation required)
7. **Statistics**: View total record count and last update time in right sidebar

## 📊 Database Schema

**Table: `submissions`**
| Column | Type | Purpose |
|--------|------|---------|
| id | INT (Primary Key) | Unique record identifier |
| fullname | VARCHAR(100) | User's full name |
| email | VARCHAR(100) | User's email address |
| position | VARCHAR(50) | Job position selected |
| skills | VARCHAR(255) | Comma-separated technical skills |
| experience | VARCHAR(50) | Years of experience |
| notes | LONGTEXT | Additional notes/comments |
| submitted_at | TIMESTAMP | When the record was created |

## 🔒 Security Features
- ✅ **SQL Injection Prevention**: Uses PDO prepared statements
- ✅ **Server-side Validation**: All data validated on backend (not just frontend)
- ✅ **Error Logging**: Errors logged server-side, generic message shown to user
- ✅ **HTML Escaping**: User input escaped when displayed
- ✅ **CORS Headers**: Set to allow requests

## ⚙️ API Endpoints

### 1. Submit Form Data
**POST** `/api/submit.php`
```
Form Data:
  - fullname (required, min 2 chars)
  - email (required, valid email)
  - position (required)
  - skills[] (optional, multiple)
  - experience (required)
  - notes (optional, max 5000 chars)

Response:
  {
    "success": true,
    "message": "Data submitted successfully",
    "data": { "id": 1 }
  }
```

### 2. Fetch All Records
**GET** `/api/fetch.php`
```
Response:
  {
    "success": true,
    "message": "Records fetched successfully",
    "data": [
      {
        "id": 1,
        "fullname": "John Doe",
        "email": "john@example.com",
        ...
      }
    ]
  }
```

### 3. Delete Record
**POST** `/api/delete.php?id=1`
```
Response:
  {
    "success": true,
    "message": "Record deleted successfully"
  }
```

### 4. Clear All Records
**POST** `/api/clear.php`
```
Response:
  {
    "success": true,
    "message": "Deleted X records successfully",
    "data": { "count": 5 }
  }
```

### 5. Download CSV
**GET** `/api/download.php`
- Returns CSV file with all data
- File name: `data_export_YYYY-MM-DD_HH-mm-ss.csv`

### 6. Copy to Clipboard (TSV)
**GET** `/api/copy.php`
- Returns tab-separated values
- Can be pasted directly into Excel/Google Sheets

## 🐛 Troubleshooting

### Error: "Database connection failed"
- Check if MySQL server is running
- Verify database credentials in `api/config.php`
- Ensure database `exercise_09_db` exists
- Run the SQL setup script

### Error: "Table doesn't exist"
- Run `database-setup.sql` in phpMyAdmin
- OR use MySQL CLI: `mysql -u root < database-setup.sql`

### Data not appearing in table after submit
- Check browser console for JavaScript errors (F12)
- Check server error log (in `api/config.php` error logging)
- Verify API endpoint URLs in `script.js`
- Check if web server is running

### CSV/Clipboard copy not working
- Check if web server is running
- Verify API endpoints are accessible
- Check browser console for errors
- Try using different browser

### 404 errors for API calls
- Ensure `api/` folder with PHP files is in same directory as `index.html`
- Check file paths in `script.js` (should be `./api/filename.php`)
- Verify web server is configured to serve PHP files

## 💡 Tips

1. **Batch Testing**: Submit multiple forms and test all features
2. **Large Datasets**: Works with thousands of records
3. **Data Export**: Use CSV download to backup data
4. **Performance**: Indexes on email and submitted_at columns for speed
5. **Security**: Remember to update DB credentials for production use

## 🔄 Data Flow

```
1. User fills form and clicks "Submit"
   ↓
2. JavaScript sends AJAX POST to api/submit.php
   ↓
3. PHP validates data and inserts into MySQL
   ↓
4. JavaScript fetches updated data from api/fetch.php
   ↓
5. Table re-renders with new data
   ↓
6. Stats updated and toast notification shown
```

## 📝 Differences from Exercise 07

| Feature | Exercise 07 | Exercise 09 |
|---------|------------|-----------|
| Storage | Browser localStorage | MySQL database |
| Persistence | Lost on browser clear | Permanent |
| Access | Single device | Multiple devices (same DB) |
| Scalability | ~5MB limit | Unlimited |
| Backup | Manual export | Database backups |
| Collaboration | Single user | Multiple users (same data) |

## 🎓 Learning Points

- **AJAX**: Asynchronous data exchange with PHP backend
- **REST APIs**: Create and consume HTTP endpoints
- **PHP**: Server-side form processing and validation
- **MySQL**: Database design and queries
- **Security**: Prepared statements, input validation, error handling
- **Full-Stack**: Bootstrap and orchestrate frontend + backend

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all files are in correct locations
3. Check browser console (F12) for JavaScript errors
4. Check server error logs
5. Ensure database credentials are correct

## 🎉 Next Steps (Enhancements)

Consider adding:
- User authentication (login/register)
- Search and filtering
- Data sorting by columns
- Pagination for large datasets
- Email notifications
- PDF export
- Edit functionality
- Duplicate detection (similar emails)
- Rate limiting for API

---

**Version**: 1.0  
**Created**: 2024  
**Author**: Exercise 09 - Database Edition
