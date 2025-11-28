from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from .models import Todo


class TodoModelTest(TestCase):
    """Test the Todo model"""
    
    def test_create_todo(self):
        """Test creating a TODO"""
        todo = Todo.objects.create(
            title="Test TODO",
            description="Test description",
            due_date=timezone.now() + timedelta(days=1)
        )
        self.assertEqual(todo.title, "Test TODO")
        self.assertEqual(todo.description, "Test description")
        self.assertFalse(todo.is_resolved)
        self.assertIsNotNone(todo.created_at)
    
    def test_todo_str(self):
        """Test Todo string representation"""
        todo = Todo.objects.create(title="Test TODO")
        self.assertEqual(str(todo), "Test TODO")
    
    def test_todo_ordering(self):
        """Test that TODOs are ordered by created_at descending"""
        todo1 = Todo.objects.create(title="First TODO")
        todo2 = Todo.objects.create(title="Second TODO")
        todos = list(Todo.objects.all())
        self.assertEqual(todos[0].title, "Second TODO")
        self.assertEqual(todos[1].title, "First TODO")


class TodoViewTest(TestCase):
    """Test the TODO views"""
    
    def setUp(self):
        """Set up test client"""
        self.client = Client()
    
    def test_home_view(self):
        """Test home page view"""
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'home.html')
    
    def test_create_todo_view(self):
        """Test creating a TODO via POST"""
        response = self.client.post(reverse('create_todo'), {
            'title': 'New TODO',
            'description': 'Test description',
            'due_date': ''
        })
        self.assertEqual(response.status_code, 302)  # Redirect after creation
        self.assertTrue(Todo.objects.filter(title='New TODO').exists())
    
    def test_create_todo_with_due_date(self):
        """Test creating a TODO with due date"""
        due_date = timezone.now() + timedelta(days=1)
        response = self.client.post(reverse('create_todo'), {
            'title': 'TODO with due date',
            'description': '',
            'due_date': due_date.strftime('%Y-%m-%dT%H:%M')
        })
        self.assertEqual(response.status_code, 302)
        todo = Todo.objects.get(title='TODO with due date')
        self.assertIsNotNone(todo.due_date)
    
    def test_create_todo_empty_title(self):
        """Test creating a TODO with empty title should fail"""
        initial_count = Todo.objects.count()
        response = self.client.post(reverse('create_todo'), {
            'title': '',
            'description': 'Test description',
            'due_date': ''
        })
        self.assertEqual(response.status_code, 302)  # Still redirects but with error message
        self.assertEqual(Todo.objects.count(), initial_count)
    
    def test_edit_todo_view_get(self):
        """Test GET request to edit TODO page"""
        todo = Todo.objects.create(title="Test TODO", description="Original description")
        response = self.client.get(reverse('edit_todo', args=[todo.id]))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'edit_todo.html')
        self.assertContains(response, "Test TODO")
        self.assertContains(response, "Original description")
    
    def test_edit_todo_view_post(self):
        """Test updating a TODO via POST"""
        todo = Todo.objects.create(title="Original Title", description="Original description")
        response = self.client.post(reverse('edit_todo', args=[todo.id]), {
            'title': 'Updated Title',
            'description': 'Updated description',
            'due_date': ''
        })
        self.assertEqual(response.status_code, 302)
        todo.refresh_from_db()
        self.assertEqual(todo.title, 'Updated Title')
        self.assertEqual(todo.description, 'Updated description')
    
    def test_edit_todo_empty_title(self):
        """Test editing a TODO with empty title should fail"""
        todo = Todo.objects.create(title="Original Title")
        original_title = todo.title
        response = self.client.post(reverse('edit_todo', args=[todo.id]), {
            'title': '',
            'description': '',
            'due_date': ''
        })
        self.assertEqual(response.status_code, 200)  # Stays on page with error
        todo.refresh_from_db()
        self.assertEqual(todo.title, original_title)  # Title unchanged
    
    def test_delete_todo_view(self):
        """Test deleting a TODO"""
        todo = Todo.objects.create(title="To Delete")
        todo_id = todo.id
        response = self.client.get(reverse('delete_todo', args=[todo.id]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Todo.objects.filter(id=todo_id).exists())
    
    def test_toggle_resolved_view(self):
        """Test toggling resolved status"""
        todo = Todo.objects.create(title="Test TODO", is_resolved=False)
        # Toggle to resolved
        response = self.client.get(reverse('toggle_resolved', args=[todo.id]))
        self.assertEqual(response.status_code, 302)
        todo.refresh_from_db()
        self.assertTrue(todo.is_resolved)
        # Toggle back to unresolved
        response = self.client.get(reverse('toggle_resolved', args=[todo.id]))
        self.assertEqual(response.status_code, 302)
        todo.refresh_from_db()
        self.assertFalse(todo.is_resolved)
    
    def test_home_view_with_todos(self):
        """Test home page displays existing TODOs"""
        todo1 = Todo.objects.create(title="First TODO")
        todo2 = Todo.objects.create(title="Second TODO", is_resolved=True)
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "First TODO")
        self.assertContains(response, "Second TODO")
    
    def test_home_view_empty(self):
        """Test home page with no TODOs"""
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No TODOs yet!")


class TodoIntegrationTest(TestCase):
    """Integration tests for complete TODO workflows"""
    
    def setUp(self):
        """Set up test client"""
        self.client = Client()
    
    def test_complete_todo_workflow(self):
        """Test complete workflow: create, edit, mark resolved, delete"""
        # Create TODO
        response = self.client.post(reverse('create_todo'), {
            'title': 'Workflow TODO',
            'description': 'Test workflow',
            'due_date': ''
        })
        self.assertEqual(response.status_code, 302)
        todo = Todo.objects.get(title='Workflow TODO')
        self.assertFalse(todo.is_resolved)
        
        # Edit TODO
        response = self.client.post(reverse('edit_todo', args=[todo.id]), {
            'title': 'Updated Workflow TODO',
            'description': 'Updated workflow',
            'due_date': ''
        })
        self.assertEqual(response.status_code, 302)
        todo.refresh_from_db()
        self.assertEqual(todo.title, 'Updated Workflow TODO')
        
        # Mark as resolved
        response = self.client.get(reverse('toggle_resolved', args=[todo.id]))
        self.assertEqual(response.status_code, 302)
        todo.refresh_from_db()
        self.assertTrue(todo.is_resolved)
        
        # Delete TODO
        response = self.client.get(reverse('delete_todo', args=[todo.id]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Todo.objects.filter(id=todo.id).exists())
