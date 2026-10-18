import customtkinter as ctk

from style import (
    BACKGROUND,
    PRIMARY,
    PRIMARY_HOVER,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    WINDOW_TITLE,
    TITLE_FONT,
)


class PizzaApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title(WINDOW_TITLE)
        self.geometry(f"{WINDOW_WIDTH}x{WINDOW_HEIGHT}")
        self.configure(fg_color=BACKGROUND)
        self.setup_gui()

    def setup_gui(self):
        title = ctk.CTkLabel(
            self,
            text="🍕 Dream Pizzas",
            font=TITLE_FONT,
            text_color=PRIMARY,
        )
        title.pack(pady=30)


if __name__ == "__main__":
    app = PizzaApp()
    app.mainloop()