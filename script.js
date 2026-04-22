(function() {
    const canvas = document.getElementById('shapeCanvas');
    const ctx = canvas.getContext('2d');
    const controls = document.getElementById('controls');
    const sizeSlider = document.getElementById('sizeSlider');
    const deleteBtn = document.getElementById('deleteBtn');

    let circles = [];
    let selectedCircle = null;
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(circle => {
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            ctx.fillStyle = (circle === selectedCircle) ? '#e74c3c' : '#3498db';
            ctx.fill();
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        });

        if (selectedCircle) {
            controls.classList.remove('hidden');
            sizeSlider.value = selectedCircle.radius;
        } else {
            controls.classList.add('hidden');
        }
    };

    const getCoords = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const handleStart = function(e) {
        const { x, y } = getCoords(e);
        const clicked = circles.find(c => {
            const dist = Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2);
            return dist < c.radius;
        });

        if (clicked) {
            selectedCircle = clicked;
            isDragging = true;
            offset.x = x - clicked.x;
            offset.y = y - clicked.y;
        } else {
            const newCircle = { x, y, radius: 20 };
            circles.push(newCircle);
            selectedCircle = newCircle;
        }
        draw();
    };

    const handleMove = function(e) {
        if (isDragging && selectedCircle) {
            if (e.cancelable) e.preventDefault();
            const { x, y } = getCoords(e);
            selectedCircle.x = x - offset.x;
            selectedCircle.y = y - offset.y;
            draw();
        }
    };

    canvas.addEventListener('mousedown', function(e) { handleStart(e); });
    canvas.addEventListener('touchstart', function(e) { handleStart(e); }, { passive: false });

    window.addEventListener('mousemove', function(e) { handleMove(e); });
    window.addEventListener('touchmove', function(e) { handleMove(e); }, { passive: false });
    window.addEventListener('mouseup', function() { isDragging = false; });
    window.addEventListener('touchend', function() { isDragging = false; });

    canvas.addEventListener('wheel', function(e) {
        if (selectedCircle) {
            e.preventDefault();
            const step = 5;
            selectedCircle.radius = Math.max(5, selectedCircle.radius + (e.deltaY < 0 ? step : -step));
            draw();
        }
    }, { passive: false });

    sizeSlider.addEventListener('input', function() {
        if (selectedCircle) {
            selectedCircle.radius = parseInt(this.value);
            draw();
        }
    });

    window.addEventListener('keydown', function(e) {
        if ((e.key === "Delete" || e.key === "Backspace") && selectedCircle) {
            circles = circles.filter(c => c !== selectedCircle);
            selectedCircle = null;
            draw();
        }
    });

    deleteBtn.addEventListener('click', function() {
        if (selectedCircle) {
            circles = circles.filter(c => c !== selectedCircle);
            selectedCircle = null;
            draw();
        }
    });

    draw();
})();