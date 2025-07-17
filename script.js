//game code

class GameOfLife {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.cellSize = Math.max(Math.min(window.innerWidth, window.innerHeight) / 90, 9); // Adaptive cell size
		this.color = "#4338ca"; // Indigo color matching your theme

		// Resize canvas to fill window
		this.resize();
		window.addEventListener("resize", () => {
			this.resize();
			this.initGrid(); // Reinitialize grid after resize
		});

		// Initialize grid
		this.initGrid();

		// Handle touch input
		this.addTouchEvent();

		// Start animation
		this.animate();
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.cols = Math.floor(this.canvas.width / this.cellSize);
		this.rows = Math.floor(this.canvas.height / this.cellSize);
	}

	initGrid() {
		this.grid = Array.from({ length: this.cols }, () =>
			Array.from({ length: this.rows }, () => Math.random() > 0.85)
		); // 15% initial population
	}

	countNeighbors(x, y) {
		let count = 0;
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) continue;
				const col = (x + i + this.cols) % this.cols;
				const row = (y + j + this.rows) % this.rows;

				// Ensure indices are non-negative
				const safeCol = col < 0 ? col + this.cols : col;
				const safeRow = row < 0 ? row + this.rows : row;

				if (this.grid[safeCol][safeRow]) count++;
			}
		}
		return count;
	}

	update() {
		const newGrid = Array.from({ length: this.cols }, () =>
			Array.from({ length: this.rows }, () => false)
		);

		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				const neighbors = this.countNeighbors(i, j);
				if (this.grid[i][j]) {
					newGrid[i][j] = neighbors === 2 || neighbors === 3;
				} else {
					newGrid[i][j] = neighbors === 3;
				}
			}
		}

		this.grid = newGrid;
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = this.color;

		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				if (this.grid[i][j]) {
					this.ctx.fillRect(
						i * this.cellSize,
						j * this.cellSize,
						this.cellSize - 1,
						this.cellSize - 1
					);
				}
			}
		}
	}

	animate() {
		this.update();
		this.draw();
		setTimeout(() => requestAnimationFrame(() => this.animate()), 120); // Slower speed for subtlety
	}

	addTouchEvent() {
		this.canvas.addEventListener("click", (event) => {
			const rect = this.canvas.getBoundingClientRect();
			const x = Math.floor((event.clientX - rect.left) / this.cellSize);
			const y = Math.floor((event.clientY - rect.top) / this.cellSize);

			if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
				this.grid[x][y] = !this.grid[x][y]; // Toggle cell state
				this.draw(); // Redraw grid
			}
		});
	}
}

// Initialize Game of Life
const canvas = document.getElementById("gameOfLife");
const game = new GameOfLife(canvas, 9); // Larger cell size for better performance

//AOS code

// Initialize AOS
AOS.init({
	duration: 1000,
	once: false,
	mirror: true,
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.getElementById("navbar");
const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
	const currentScroll = window.pageYOffset;

	// Navbar hide/show
	if (currentScroll <= 0) {
		navbar.style.transform = "translateY(0)";
	} else if (currentScroll > lastScroll && currentScroll > 50) {
		navbar.style.transform = "translateY(-100%)";
	} else if (currentScroll < lastScroll) {
		navbar.style.transform = "translateY(0)";
	}

	// Scroll to top button visibility
	if (currentScroll > 500) {
		scrollToTopBtn.classList.remove("hidden");
		setTimeout(() => (scrollToTopBtn.style.opacity = "1"), 50);
	} else {
		scrollToTopBtn.style.opacity = "0";
		setTimeout(() => scrollToTopBtn.classList.add("hidden"), 300);
	}

	lastScroll = currentScroll;
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		document.querySelector(this.getAttribute("href")).scrollIntoView({
			behavior: "smooth",
		});
	});
});

// Scroll to top functionality
scrollToTopBtn.addEventListener("click", () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
});

// Progress Bar Logic
const progressBar = document.getElementById("progress-bar");

window.addEventListener("scroll", () => {
	const windowHeight = window.innerHeight;
	const documentHeight = document.documentElement.scrollHeight;
	const scrollTop = window.scrollY;
	const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
	progressBar.style.width = `${progress}%`;
});

////filter code //////

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		// Remove active class from all buttons
		filterButtons.forEach((btn) =>
			btn.classList.remove("active", "bg-indigo-500", "text-white")
		);
		filterButtons.forEach((btn) => btn.classList.add("bg-gray-800/50"));

		// Add active class to clicked button
		button.classList.add("active", "bg-indigo-500", "text-white");
		button.classList.remove("bg-gray-800/50");

		const filterValue = button.getAttribute("data-filter");

		projectCards.forEach((card) => {
			if (
				filterValue === "all" ||
				card.getAttribute("data-category") === filterValue
			) {
				card.style.display = "block";
			} else {
				card.style.display = "none";
			}
		});
	});
});
