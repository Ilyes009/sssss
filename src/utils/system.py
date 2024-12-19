import os

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def set_terminal_title(title):
    """Set the terminal title."""
    if os.name == 'nt':
        os.system(f'title {title}')
    else:
        import sys
        sys.stdout.write(f"\x1b]2;{title}\x07")