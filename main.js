const container = document.querySelector('.cloud-container');
const circleSizes = [100, 80, 120]; // Adjust the sizes of the circles
const circlePositions = [
  { top: 50, left: '20%' },
  { top: 80, left: '40%' },
  { top: 40, left: '60%' }
]; // Adjust the positions of the circles

circleSizes.forEach((size, index) => {
  const circle = document.createElement('div');
  circle.classList.add('circle');
  circle.style.width = size + 'px';
  circle.style.height = size + 'px';
  circle.style.top = circlePositions[index].top + 'px';
  circle.style.left = circlePositions[index].left;
  container.appendChild(circle);
});