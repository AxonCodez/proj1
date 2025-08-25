document.addEventListener('DOMContentLoaded', () => {
  const anandName = document.getElementById('gsap-name');
  if (!anandName) {
    console.error('Element with id "gsap-name" not found');
    return;
  }

  // Wrap each letter in a span
  anandName.innerHTML = anandName.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

  // Animate letters on page load
  anime.timeline({loop: false})
    .add({
      targets: '#gsap-name .letter',
      translateY: [50, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 700,
      delay: (el, i) => 150 * i
    });
});
