# Django TODO Application

A full-featured TODO application built with Django that allows you to create, edit, delete, and manage your tasks with due dates and resolution tracking.

## Features

- ✅ **Create TODOs** - Add new tasks with title, description, and optional due dates
- ✏️ **Edit TODOs** - Update existing tasks
- 🗑️ **Delete TODOs** - Remove tasks you no longer need
- 📅 **Due Dates** - Assign due dates to track deadlines
- ✔️ **Mark as Resolved** - Toggle task completion status
- 🎨 **Modern UI** - Beautiful, responsive interface
- 🧪 **Fully Tested** - Comprehensive test coverage

## Requirements

- Python 3.8 or higher
- Django 5.2.8 or higher

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd ToDo
   ```

2. **Create a virtual environment (if not already created):**
   ```bash
   python3 -m venv venv
   ```

3. **Activate the virtual environment:**
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

## Running the Application

1. **Activate the virtual environment:**
   ```bash
   source venv/bin/activate
   ```

2. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

3. **Open your browser and visit:**
   ```
   http://127.0.0.1:8000/
   ```

## Project Structure

```
ToDo/
├── manage.py                 # Django management script
├── requirements.txt         # Python dependencies
├── db.sqlite3               # SQLite database (created after migrations)
├── templates/               # HTML templates
│   ├── base.html           # Base template with styling
│   ├── home.html           # Home page with TODO list
│   └── edit_todo.html      # Edit TODO page
├── todo_project/            # Main project directory
│   ├── settings.py         # Django settings
│   ├── urls.py             # Main URL configuration
│   ├── wsgi.py             # WSGI configuration
│   └── asgi.py             # ASGI configuration
└── todos/                   # TODO app
    ├── models.py           # Todo model definition
    ├── views.py            # View functions
    ├── urls.py             # App URL configuration
    ├── admin.py            # Admin panel configuration
    ├── tests.py            # Test cases
    └── migrations/         # Database migrations
```

## Usage

### Creating a TODO

1. On the home page, fill in the "Create New TODO" form
2. Enter a title (required)
3. Optionally add a description and due date
4. Click "Create TODO"

### Editing a TODO

1. Click the "Edit" button on any TODO item
2. Modify the title, description, or due date
3. Click "Update TODO"

### Marking as Resolved

- Click "Mark as Resolved" on any pending TODO
- Click "Mark as Unresolved" to toggle back

### Deleting a TODO

- Click the "Delete" button on any TODO
- Confirm the deletion in the popup dialog

## Testing

Run the test suite with:

```bash
python manage.py test
```

The application includes comprehensive tests covering:
- Model creation and validation
- View functionality (create, edit, delete, toggle)
- Edge cases and error handling
- Integration workflows

All 15 tests should pass successfully.

## Admin Panel

Access the Django admin panel at:
```
http://127.0.0.1:8000/admin/
```

First, create a superuser:
```bash
python manage.py createsuperuser
```

The Todo model is registered in the admin panel with filtering and search capabilities.

## Database

The application uses SQLite by default. The database file (`db.sqlite3`) is created automatically when you run migrations.

## Development

### Making Changes to Models

If you modify the models:

1. Create migrations:
   ```bash
   python manage.py makemigrations
   ```

2. Apply migrations:
   ```bash
   python manage.py migrate
   ```

### Static Files

Static files are served automatically in development mode. For production, run:
```bash
python manage.py collectstatic
```

## License

This project is open source and available for educational purposes.

## Author

Built as a Django learning project demonstrating CRUD operations, models, views, templates, and testing.

