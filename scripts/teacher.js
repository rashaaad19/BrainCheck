  let A = document.querySelectorAll('svg');

        A.forEach(svg => {
            svg.addEventListener('click', () => {

             svg.classList.toggle('active');
            });
        });