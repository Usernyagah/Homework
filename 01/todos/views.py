from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Todo


def home(request):
    """Display all TODOs"""
    todos = Todo.objects.all()
    return render(request, 'home.html', {'todos': todos})


def create_todo(request):
    """Create a new TODO"""
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        due_date = request.POST.get('due_date') or None
        
        if title:
            Todo.objects.create(
                title=title,
                description=description,
                due_date=due_date
            )
            messages.success(request, 'TODO created successfully!')
            return redirect('home')
        else:
            messages.error(request, 'Title is required!')
    
    return redirect('home')


def edit_todo(request, todo_id):
    """Edit an existing TODO"""
    todo = get_object_or_404(Todo, id=todo_id)
    
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        due_date = request.POST.get('due_date') or None
        
        if title:
            todo.title = title
            todo.description = description
            todo.due_date = due_date
            todo.save()
            messages.success(request, 'TODO updated successfully!')
            return redirect('home')
        else:
            messages.error(request, 'Title is required!')
    
    return render(request, 'edit_todo.html', {'todo': todo})


def delete_todo(request, todo_id):
    """Delete a TODO"""
    todo = get_object_or_404(Todo, id=todo_id)
    todo.delete()
    messages.success(request, 'TODO deleted successfully!')
    return redirect('home')


def toggle_resolved(request, todo_id):
    """Toggle the resolved status of a TODO"""
    todo = get_object_or_404(Todo, id=todo_id)
    todo.is_resolved = not todo.is_resolved
    todo.save()
    status = 'resolved' if todo.is_resolved else 'unresolved'
    messages.success(request, f'TODO marked as {status}!')
    return redirect('home')
