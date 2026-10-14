from menu import PizzaApp
if __name__ == "__main__":
    app = PizzaApp()
    app.mainloop()
    import customtkinter as ctk

    from style import (
    BACKGROUND,
    PRIMARY,
    PRIMARY_HOVER,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    WINDOW_TITLE,
    TITLE_FONT
)

class PizzaApp(ctk.CTk):

    def __init__(self):

        super().__init__()

        self.title("Dream Pizza Ordering System")

        self.geometry("900x650")

        self.setup_gui()

    def setup_gui(self):
        pass
    