let colors = [
    [205, 180, 219], // cdb4db - 淺紫色
    [255, 200, 221], // ffc8dd - 嫩粉色
    [255, 175, 204], // ffafcc - 鮭魚粉
    [189, 224, 254], // bde0fe - 天藍色
    [162, 210, 255]  // a2d2ff - 較深藍色
];

// 宣告一個空陣列，用來儲存所有圓圈的資料
let circles = [];
// 新增粒子陣列
let particles = []; 

// setup() 函式：程式啟動時只執行一次
function setup() {
    // 建立全螢幕畫布
    createCanvas(windowWidth, windowHeight);
    
    // 產生 20 個圓
    for (let i = 0; i < 20; i++) {
        let size = random(20, 100); // 隨機大小 (直徑 20 到 100)
        
        let circle = {
            x: random(width), // 隨機 X 位置
            y: random(height), // 隨機 Y 位置 (從畫布隨機位置開始)
            size: size,
            color: random(colors), // 從顏色陣列中隨機選一個顏色
            alpha: random(50, 255), // 隨機透明度
            // 速度計算：直徑越大，速度越慢
            speed: map(size, 20, 100, 2, 0.5)
        };
        circles.push(circle);
    }
    
    // 取消所有圖形的邊框
    noStroke();
}

// draw() 函式：每秒執行 60 次，用來更新動畫和畫圖
function draw() {
    // 每次重畫畫面時，先填上米色背景
    background('#f8f8f1'); // 背景米色
    
    // -----------------------------
    // 1. 處理並畫出每個圓圈
    // -----------------------------
    for (let circle of circles) {
        // 繪製圓圈
        fill(circle.color[0], circle.color[1], circle.color[2], circle.alpha);
        ellipse(circle.x, circle.y, circle.size);
        
        // 加入反光點
        fill(255, 255, 255, circle.alpha); // 使用白色，保持相同的透明度
        let highlightSize = circle.size * 0.15; // 反光點大小為氣球的 15%
        let highlightX = circle.x + circle.size * 0.25; // 位於氣球右側偏上
        let highlightY = circle.y - circle.size * 0.25; // 位於氣球上方偏右
        ellipse(highlightX, highlightY, highlightSize);
        
        // 更新圓圈位置：往上飄
        circle.y -= circle.speed; 
        
        // 判斷是否飄到畫布頂端
        if (circle.y < -circle.size / 2) {
            
            // === 爆破效果：在圓圈消失處（畫布頂端）產生粒子 ===
            let explosionY = 0; // 爆破點在畫面頂端
            
            for (let i = 0; i < 20; i++) { // 產生 20 個粒子
                let angle = random(TWO_PI); // 隨機方向
                let speed = random(1, 5); // 隨機速度
                
                particles.push({
                    x: circle.x,
                    y: explosionY, 
                    // 速度分量：使用三角函數計算 x, y 速度
                    vx: cos(angle) * speed,
                    vy: sin(angle) * speed,
                    alpha: 255, // 初始完全不透明
                    color: circle.color
                });
            }
            
            // === 重置圓圈 ===
            circle.y = height + circle.size / 2; // 移到畫布底部
            circle.x = random(width);
            circle.size = random(20, 100); 
            circle.speed = map(circle.size, 20, 100, 2, 0.5);
            circle.alpha = random(50, 255);
            circle.color = random(colors); // 重新隨機選一個顏色
        }
    }
    
    // -----------------------------
    // 2. 畫並更新粒子
    // -----------------------------
    // 從陣列尾端向前遍歷，才能安全地刪除元素
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        fill(p.color[0], p.color[1], p.color[2], p.alpha);
        ellipse(p.x, p.y, 5); // 畫粒子，固定大小 5
        
        // 更新粒子位置
        p.x += p.vx;
        p.y += p.vy;
        
        // 讓粒子逐漸變透明
        p.alpha -= 5;
        
        // 如果粒子完全透明，從陣列中移除
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
    
    // 在左上角顯示學號
    fill(0); // 使用黑色
    textSize(20); // 設定文字大小
    text('414730258', 10, 30); // 在座標 (10, 30) 顯示學號
}


