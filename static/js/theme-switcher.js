// Icon Update and Theme Switching
function setTheme(theme, saveToLocalStorage = false) {
	if (theme === "system") {
		document.documentElement.removeAttribute("data-theme");
	} else {
		document.documentElement.setAttribute("data-theme", theme);
	}

	if (saveToLocalStorage) {
		localStorage.setItem("theme", theme);
	} else {
		localStorage.removeItem("theme");
	}

	// Update icon class based on the selected theme.
	updateIconClass(theme);

	// Update the active button based on the selected theme.
	updateActiveButton(theme);
}

function resetTheme() {
	// Reset the theme to the default or system preference if no default is set.
	setTheme(window.defaultTheme || "system");
}

function switchTheme(theme) {
	if (theme === "system") {
		resetTheme();
	} else {
		setTheme(theme, true);
	}
}

function updateIconClass(theme) {
	const iconElement = document.querySelector("#theme-switcher summary .icon");

	// Remove any existing theme classes
	iconElement.classList.remove("light", "dark");

	// Add the appropriate class based on the selected theme
	if (theme === "light") {
		iconElement.classList.add("light");
	} else if (theme === "dark") {
		iconElement.classList.add("dark");
	}
}

function updateActiveButton(theme) {
	// Remove .active class from all buttons
	document.querySelectorAll('#theme-switcher button').forEach(button => {
		button.classList.remove('active');
	});

	// Add .active class to the button corresponding to the current theme
	const activeButton = document.querySelector(`#theme-${theme}`);
	if (activeButton) {
		activeButton.classList.add('active');
	}
}

document.getElementById("theme-light").addEventListener("click", function () {
	switchTheme("light");
});
document.getElementById("theme-dark").addEventListener("click", function () {
	switchTheme("dark");
});
document.getElementById("theme-system").addEventListener("click", function () {
	switchTheme("system");
});

// Update icon class on page load based on current theme
const currentTheme = localStorage.getItem("theme") || window.defaultTheme || "system";
updateIconClass(currentTheme);
updateActiveButton(currentTheme);

// Make the switchTheme function accessible globally
window.switchTheme = switchTheme;
