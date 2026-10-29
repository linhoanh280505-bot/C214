// ================================
// 1. 商品資料
// ================================

const products = [
    {
        id: 1,
        name: "可愛毛線小熊",
        category: "毛線娃娃",
        price: 380,
        emoji: "🧸",
        description: "療癒可愛，適合送給重要的人。"
    },
    {
        id: 2,
        name: "浪漫毛線花束",
        category: "毛線花束",
        price: 580,
        emoji: "💐",
        description: "用永不凋謝的花束傳遞心意。"
    },
    {
        id: 3,
        name: "手工毛線包包",
        category: "毛線包包",
        price: 680,
        emoji: "👜",
        description: "可愛又實用，打造自己的風格。"
    },
    {
        id: 4,
        name: "毛線小兔吊飾",
        category: "毛線吊飾",
        price: 180,
        emoji: "🐰",
        description: "小巧可愛，適合掛在包包上。"
    },
    {
        id: 5,
        name: "毛線小貓娃娃",
        category: "毛線娃娃",
        price: 350,
        emoji: "🐱",
        description: "柔軟可愛的手作小夥伴。"
    },
    {
        id: 6,
        name: "溫柔粉色花束",
        category: "毛線花束",
        price: 520,
        emoji: "🌷",
        description: "適合生日、紀念日與節日送禮。"
    },
    {
        id: 7,
        name: "奶油色手提包",
        category: "毛線包包",
        price: 750,
        emoji: "👝",
        description: "溫柔簡約，展現手作特色。"
    },
    {
        id: 8,
        name: "毛線愛心吊飾",
        category: "毛線吊飾",
        price: 120,
        emoji: "💗",
        description: "把小小的愛心掛在身邊。"
    }
];


// ================================
// 2. 購物車資料
// ================================

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("zhixinCart") || "[]"
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            products.some(product =>
                product.id === item.id
            ) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    }
} catch (error) {
    cart = [];
}


// ================================
// 3. 顯示商品
// ================================

const productGrid = document.getElementById("productGrid");

function renderProducts(category = "全部") {

    const filteredProducts = category === "全部"
        ? products
        : products.filter(product =>
            product.category === category
        );

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">

            <div class="product-image">
                ${product.emoji}
            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <p class="product-price">
                    NT$ ${product.price}
                </p>

                <button
                    class="add-cart-btn"
                    data-id="${product.id}"
                >
                    🛒 加入購物車
                </button>

            </div>

        </article>
    `).join("");
}


// 網站開啟時顯示全部商品
renderProducts();


// ================================
// 4. 商品分類切換
// ================================

document.querySelectorAll(".category-btn").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".category-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderProducts(button.dataset.category);
    });

});


// ================================
// 5. 儲存購物車
// ================================

function saveCart() {

    try {
        localStorage.setItem(
            "zhixinCart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.warn("無法儲存購物車資料。");
    }

}


// ================================
// 6. 加入購物車
// ================================

productGrid.addEventListener("click", event => {

    const button = event.target.closest(".add-cart-btn");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const product = products.find(item =>
        item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(item =>
        item.id === productId
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    alert(`已將「${product.name}」加入購物車！`);
});


// ================================
// 7. 更新購物車數量
// ================================

function updateCart() {

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.getElementById("cartCount").textContent = count;

    saveCart();
    renderCart();
}


// ================================
// 8. 顯示購物車
// ================================

function renderCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p style="text-align:center; padding:25px;">
                🧺 購物車目前是空的，快去挑選喜歡的商品吧！
            </p>
        `;

        cartTotal.textContent = "0";

        return;
    }

    let total = 0;

    cartItems.innerHTML = cart.map(item => {

        const product = products.find(product =>
            product.id === item.id
        );

        if (!product) return "";

        const subtotal = product.price * item.quantity;

        total += subtotal;

        return `
            <div class="cart-row">

                <div>
                    <h3>
                        ${product.emoji} ${product.name}
                    </h3>

                    <p>
                        NT$ ${product.price} × ${item.quantity}
                    </p>

                    <p>
                        小計：NT$ ${subtotal}
                    </p>
                </div>

                <div class="cart-actions">

                    <button
                        data-action="minus"
                        data-id="${product.id}"
                        aria-label="減少數量"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="plus"
                        data-id="${product.id}"
                        aria-label="增加數量"
                    >+</button>

                    <button
                        class="remove-btn"
                        data-action="remove"
                        data-id="${product.id}"
                    >刪除</button>

                </div>

            </div>
        `;

    }).join("");

    cartTotal.textContent = total.toLocaleString("zh-TW");
}


// ================================
// 9. 修改購物車商品數量
// ================================

document.getElementById("cartItems").addEventListener(
    "click",
    event => {

        const button = event.target.closest("button");

        if (!button) return;

        const action = button.dataset.action;
        const id = Number(button.dataset.id);

        const item = cart.find(item => item.id === id);

        if (!item) return;

        if (action === "plus") {
            item.quantity++;
        }

        if (action === "minus") {
            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }
        }

        if (action === "remove") {
            cart = cart.filter(item => item.id !== id);
        }

        updateCart();
    }
);


// ================================
// 10. 開啟與關閉購物車
// ================================

const cartModal = document.getElementById("cartModal");

document.getElementById("cartBtn").addEventListener(
    "click",
    () => {
        renderCart();
        cartModal.classList.add("show");
    }
);

document.getElementById("closeCart").addEventListener(
    "click",
    () => {
        cartModal.classList.remove("show");
    }
);


// ================================
// 11. 會員登入與註冊介面
// ================================

const memberModal = document.getElementById("memberModal");
const memberTitle = document.getElementById("memberTitle");
const memberForm = document.getElementById("memberForm");
const switchMember = document.getElementById("switchMember");

let isRegister = false;

document.getElementById("memberBtn").addEventListener(
    "click",
    () => {
        memberModal.classList.add("show");
    }
);

document.getElementById("closeMember").addEventListener(
    "click",
    () => {
        memberModal.classList.remove("show");
    }
);


// 切換登入與註冊畫面
switchMember.addEventListener("click", () => {

    isRegister = !isRegister;

    memberTitle.textContent = isRegister
        ? "會員註冊"
        : "會員登入";

    memberForm.querySelector("button[type='submit']").textContent =
        isRegister ? "註冊會員" : "登入";

    switchMember.textContent = isRegister
        ? "已經有帳號？返回登入"
        : "還沒有帳號？註冊會員";

});


// 示範登入與註冊
memberForm.addEventListener("submit", event => {

    event.preventDefault();

    const email = document.getElementById("memberEmail").value;

    if (isRegister) {

        alert(
            `註冊介面測試成功！\n電子郵件：${email}\n\n` +
            "目前尚未建立真正的會員帳號，請先連接後端資料庫。"
        );

    } else {

        alert(
            "這是會員登入示範介面。\n" +
            "正式登入功能需要建立會員資料庫及後端驗證。"
        );

    }

});


// ================================
// 12. 結帳按鈕
// ================================

document.getElementById("checkoutBtn").addEventListener(
    "click",
    () => {

        if (cart.length === 0) {
            alert("購物車目前沒有商品！");
            return;
        }

        const total = cart.reduce((sum, item) => {

            const product = products.find(product =>
                product.id === item.id
            );

            return sum + (
                product ? product.price * item.quantity : 0
            );

        }, 0);

        alert(
            `訂單確認示範\n\n` +
            `商品種類：${cart.length} 種\n` +
            `商品總金額：NT$ ${total.toLocaleString("zh-TW")}\n\n` +
            "下一步可以建立收件資料、付款方式與訂單確認頁面。"
        );

    }
);


// ================================
// 13. 聯絡我們表單
// ================================

document.getElementById("contactForm").addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const name = document.getElementById("contactName").value;

        alert(
            `謝謝 ${name} 的留言！\n\n` +
            "目前這是表單操作示範，尚未將訊息寄出或儲存。"
        );

        event.target.reset();

    }
);


// ================================
// 14. 手機版導覽選單
// ================================

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {

    nav.classList.toggle("open");

});


// 點擊選單後關閉手機版導覽
nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {
        nav.classList.remove("open");
    });

});


// 點擊視窗外側，關閉彈出視窗
[memberModal, cartModal].forEach(modal => {

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            modal.classList.remove("show");
        }

    });

});


// ================================
// 15. 初始化購物車
// ================================

updateCart();

console.log("織心手工藝網站已成功載入！");