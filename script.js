document.addEventListener('DOMContentLoaded', function() {
    // عناصر واجهة المستخدم
    const fetchImagesBtn = document.getElementById('fetch-images-btn');
    const statusMessage = document.getElementById('status-message');
    const sectionHeaders = document.querySelectorAll('.section-header');
    const sectionContents = document.querySelectorAll('.section-content');
    const loadingSpinner = document.getElementById('loading-spinner');
    const levelButtons = document.querySelectorAll('.section-header'); // أزرار المستويات
    
    // مصفوفة لتخزين بيانات الصور
    let productImages = [];
    let productsLoaded = false; // لتتبع ما إذا تم تحميل المنتجات بالفعل
    
    // عنوان صفحة منتجات Hay Day
    const productPageUrl = 'https://hayday.fandom.com/wiki/Products';
    
    // إضافة مستمعي الأحداث للأزرار
    fetchImagesBtn.addEventListener('click', fetchProductImages);
    
    // تحميل المنتجات تلقائياً عند تحميل الصفحة
    fetchProductImages();
    
    // إضافة مستمعي الأحداث لرؤوس الأقسام
    sectionHeaders.forEach(header => {
        header.addEventListener('click', async function() {
            // إذا لم تكن الصور محمّلة بعد، قم بتحميلها تلقائياً أولاً
            if (!productsLoaded) {
                statusMessage.textContent = 'جاري جلب صور المنتجات تلقائياً...';
                // استدعاء دالة جلب الصور
                await fetchProductImages();
                // إذا فشل التحميل، توقف
                if (!productsLoaded) {
                    statusMessage.textContent = 'فشل جلب صور المنتجات. حاول مرة أخرى.';
                    statusMessage.style.color = '#e74c3c';
                    setTimeout(() => {
                        statusMessage.style.color = '';
                    }, 2000);
                    return;
                }
            }
            
            const minLevel = parseInt(this.getAttribute('data-min-level'));
            const maxLevel = parseInt(this.getAttribute('data-max-level'));
            const sectionContent = this.nextElementSibling;
            const isActive = sectionContent.classList.contains('active');
            
            // تبديل حالة القسم الحالي فقط (فتح/إغلاق)
            if (isActive) {
                // إذا كان القسم مفتوحاً، أغلقه
                this.classList.remove('active');
                sectionContent.classList.remove('active');
                
                statusMessage.textContent = `تم إغلاق قسم المستوى ${minLevel} - ${maxLevel}.`;
                statusMessage.style.color = '#3498db';
                setTimeout(() => {
                    statusMessage.style.color = '';
                }, 2000);
            } else {
                // إذا كان القسم مغلقاً، أغلق جميع الأقسام الأخرى أولاً
                sectionHeaders.forEach(h => h.classList.remove('active'));
                sectionContents.forEach(c => c.classList.remove('active'));
                
                // ثم افتح هذا القسم
                this.classList.add('active');
                sectionContent.classList.add('active');
                
                // تصفية وعرض المنتجات المطابقة لنطاق المستوى
                displayProductsByLevel(minLevel, maxLevel, sectionContent);
                
                statusMessage.textContent = `تم عرض منتجات المستوى ${minLevel} - ${maxLevel}.`;
                statusMessage.style.color = '#2ecc71';
                setTimeout(() => {
                    statusMessage.style.color = '';
                }, 2000);
            }
        });
    });
    
    // دالة لعرض المنتجات حسب نطاق المستوى
    function displayProductsByLevel(minLevel, maxLevel, container) {
        // مسح محتوى الحاوية
        container.innerHTML = '';
        
        // تصفية المنتجات حسب نطاق المستوى
        const filteredProducts = productImages.filter(product => 
            product.level >= minLevel && product.level <= maxLevel
        );
        
        // إذا لم توجد منتجات لهذا النطاق
        if (filteredProducts.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '2rem';
            emptyMessage.style.width = '100%';
            emptyMessage.style.gridColumn = '1 / -1';
            emptyMessage.textContent = `لا توجد منتجات متوفرة للمستويات ${minLevel} - ${maxLevel}.`;
            container.appendChild(emptyMessage);
            return;
        }
        
        // إنشاء بطاقات للمنتجات المصفاة وإضافتها إلى الحاوية
        filteredProducts.forEach(product => {
            const productContainer = createImageCard(product);
            container.appendChild(productContainer);
        });
    }
    
    // دالة لجلب صور المنتجات من موقع Hay Day Wiki
    async function fetchProductImages() {
        // إظهار مؤشر التحميل وتعطيل الزر
        loadingSpinner.classList.remove('hidden');
        fetchImagesBtn.disabled = true;
        statusMessage.textContent = 'جارٍ جلب صور المنتجات...';

        try {
            // إنشاء الصور باستخدام بيانات المنتجات المعرفة مسبقًا
            productImages = [
                // المستوى 1-25
                // Row 1
                { name: 'Bread', url: 'https://static.wikia.nocookie.net/hayday/images/e/e1/Bread.png/revision/latest/scale-to-width-down/75?cb=20240205073518', level: 2 },
                { name: 'Chicken Feed', url: 'https://static.wikia.nocookie.net/hayday/images/6/6a/Chicken_Feed.png/revision/latest/scale-to-width-down/75?cb=20150712161950', level: 3 },
                { name: 'Cow Feed', url: 'https://static.wikia.nocookie.net/hayday/images/f/f6/Cow_Feed.png/revision/latest/scale-to-width-down/75?cb=20150712161956', level: 6 },
                { name: 'Cream', url: 'https://static.wikia.nocookie.net/hayday/images/8/83/Cream.png/revision/latest/scale-to-width-down/75?cb=20240205163032', level: 6 },
                
                // Row 2
                { name: 'Corn Bread', url: 'https://static.wikia.nocookie.net/hayday/images/1/1d/Corn_Bread.png/revision/latest/scale-to-width-down/75?cb=20240205073836', level: 7 },
                { name: 'Brown Sugar', url: 'https://static.wikia.nocookie.net/hayday/images/0/02/Brown_Sugar.png/revision/latest/scale-to-width-down/75?cb=20240205163705', level: 7 },
                { name: 'Popcorn', url: 'https://static.wikia.nocookie.net/hayday/images/8/85/Popcorn.png/revision/latest/scale-to-width-down/75?cb=20240206170036', level: 8 },
                { name: 'Butter', url: 'https://static.wikia.nocookie.net/hayday/images/f/f1/Butter.png/revision/latest/scale-to-width-down/75?cb=20240205163128', level: 9 },
                
                // Row 3
                { name: 'Plain Waffles', url: 'https://static.wikia.nocookie.net/hayday/images/6/66/Plain_Waffles.png/revision/latest/scale-to-width-down/75?cb=20240217133029', level: 114 },
                { name: 'Pig Feed', url: 'https://static.wikia.nocookie.net/hayday/images/e/e4/Pig_Feed.png/revision/latest/scale-to-width-down/75?cb=20150712161939', level: 10 },
                { name: 'Cookie', url: 'https://static.wikia.nocookie.net/hayday/images/7/70/Cookie.png/revision/latest/scale-to-width-down/75?cb=20240205074046', level: 10 },
                { name: 'Bacon and Eggs', url: 'https://static.wikia.nocookie.net/hayday/images/a/a6/Bacon_and_Eggs.png/revision/latest/scale-to-width-down/75?cb=20240205164211', level: 11 },
                
                // Row 4
                { name: 'Cheese', url: 'https://static.wikia.nocookie.net/hayday/images/a/a5/Cheese.png/revision/latest/scale-to-width-down/75?cb=20240205163241', level: 12 },
                { name: 'White Sugar', url: 'https://static.wikia.nocookie.net/hayday/images/f/ff/White_Sugar.png/revision/latest/scale-to-width-down/75?cb=20240205163815', level: 13 },
                { name: 'Carrot Pie', url: 'https://static.wikia.nocookie.net/hayday/images/0/0b/Carrot_Pie.png/revision/latest/scale-to-width-down/75?cb=20240207083902', level: 14 },
                { name: 'Pumpkin Pie', url: 'https://static.wikia.nocookie.net/hayday/images/7/7d/Pumpkin_Pie.png/revision/latest/scale-to-width-down/75?cb=20240207150900', level: 15 },
                
                // Row 5
                { name: 'Sheep Feed', url: 'https://static.wikia.nocookie.net/hayday/images/5/58/Sheep_Feed.png/revision/latest/scale-to-width-down/75?cb=20150712162003', level: 16 },
                { name: 'Buttered Popcorn', url: 'https://static.wikia.nocookie.net/hayday/images/8/88/Buttered_Popcorn.png/revision/latest/scale-to-width-down/75?cb=20240206170136', level: 16 },
                { name: 'Sweater', url: 'https://static.wikia.nocookie.net/hayday/images/7/73/Sweater.png/revision/latest/scale-to-width-down/75?cb=20240207155705', level: 17 },
                { name: 'Bacon Pie', url: 'https://static.wikia.nocookie.net/hayday/images/b/b4/Bacon_Pie.png/revision/latest/scale-to-width-down/75?cb=20240207145633', level: 18 },
                
                // Row 6
                { name: 'Syrup', url: 'https://static.wikia.nocookie.net/hayday/images/2/2f/Syrup.png/revision/latest/scale-to-width-down/75?cb=20240205163903', level: 18 },
                { name: 'Cotton Fabric', url: 'https://static.wikia.nocookie.net/hayday/images/0/01/Cotton_Fabric.png/revision/latest/scale-to-width-down/75?cb=20240207155935', level: 18 },
                { name: 'Hamburger', url: 'https://static.wikia.nocookie.net/hayday/images/a/a4/Hamburger.png/revision/latest/scale-to-width-down/75?cb=20191023233032', level: 18 },
                { name: 'Raspberry Muffin', url: 'https://static.wikia.nocookie.net/hayday/images/2/22/Raspberry_Muffin.png/revision/latest/scale-to-width-down/75?cb=20240205074215', level: 19 },
                
                // Row 7
                { name: 'Blue Woolly Hat', url: 'https://static.wikia.nocookie.net/hayday/images/0/03/Blue_Woolly_Hat.png/revision/latest/scale-to-width-down/75?cb=20240207155851', level: 19 },
                { name: 'Cotton Shirt', url: 'https://static.wikia.nocookie.net/hayday/images/6/66/Cotton_Shirt.png/revision/latest/scale-to-width-down/75?cb=20150711231709', level: 19 },
                { name: 'Blue Sweater', url: 'https://static.wikia.nocookie.net/hayday/images/3/37/Blue_Sweater.png/revision/latest/scale-to-width-down/75?cb=20240207155757', level: 20 },
                { name: 'Carrot Cake', url: 'https://static.wikia.nocookie.net/hayday/images/d/dd/Carrot_Cake.png/revision/latest/scale-to-width-down/75?cb=20240223073206', level: 21 },
                
                // Row 8
                { name: 'Wooly Chaps', url: 'https://static.wikia.nocookie.net/hayday/images/2/22/Wooly_Chaps.png/revision/latest/scale-to-width-down/75?cb=20150711231659', level: 21 },
                { name: 'Cream Cake', url: 'https://static.wikia.nocookie.net/hayday/images/7/73/Cream_Cake.png/revision/latest/scale-to-width-down/75?cb=20240223073301', level: 23 },
                { name: 'Red Berry Cake', url: 'https://static.wikia.nocookie.net/hayday/images/6/69/Red_Berry_Cake.png/revision/latest/scale-to-width-down/75?cb=20240223073738', level: 23 },
                { name: 'Cheesecake', url: 'https://static.wikia.nocookie.net/hayday/images/2/2d/Cheesecake.png/revision/latest/scale-to-width-down/75?cb=20240223073836', level: 24 },
                
                // Row 9
                { name: 'Silver Ore', url: 'https://static.wikia.nocookie.net/hayday/images/9/97/Silver_Ore.png/revision/latest/scale-to-width-down/75?cb=20150711233621', level: 24 },
                { name: 'Gold Ore', url: 'https://static.wikia.nocookie.net/hayday/images/f/f7/Gold_Ore.png/revision/latest/scale-to-width-down/75?cb=20240208090745', level: 24 },
                { name: 'Platinum Ore', url: 'https://static.wikia.nocookie.net/hayday/images/b/b0/Platinum_Ore.png/revision/latest/scale-to-width-down/75?cb=20240208090844', level: 24 },
                { name: 'Silver Bar', url: 'https://static.wikia.nocookie.net/hayday/images/9/94/Silver_Bar.png/revision/latest/scale-to-width-down/75?cb=20240208090436', level: 24 },
                
                // Row 10
                { name: 'Chili Popcorn', url: 'https://static.wikia.nocookie.net/hayday/images/7/7c/Chili_Popcorn.png/revision/latest/scale-to-width-down/75?cb=20240206170227', level: 25 },
                { name: 'Gold Bar', url: 'https://static.wikia.nocookie.net/hayday/images/4/4e/Gold_Bar.png/revision/latest/scale-to-width-down/75?cb=20240208090745', level: 25 },
                { name: 'Platinum Bar', url: 'https://static.wikia.nocookie.net/hayday/images/d/d2/Platinum_Bar.png/revision/latest/scale-to-width-down/75?cb=20240208090844', level: 25 },
                { name: 'Violet Dress', url: 'https://static.wikia.nocookie.net/hayday/images/3/33/Violet_Dress.png/revision/latest/scale-to-width-down/75?cb=20240411152554', level: 25 },
                
                // المستوى 26-50
                // Row 1
                { name: 'Blackberry Muffin', url: 'https://static.wikia.nocookie.net/hayday/images/c/c9/Blackberry_Muffin.png/revision/latest/scale-to-width-down/75?cb=20240205074434', level: 26 },
                { name: 'Carrot Juice', url: 'https://static.wikia.nocookie.net/hayday/images/e/e0/Carrot_Juice.png/revision/latest/scale-to-width-down/75?cb=20150711232322', level: 26 },
                { name: 'Fish Burger', url: 'https://static.wikia.nocookie.net/hayday/images/7/7e/Fish_Burger.png/revision/latest/scale-to-width-down/75?cb=20240205164539', level: 27 },
                { name: 'Red Lure', url: 'https://static.wikia.nocookie.net/hayday/images/9/96/Red_Lure.png/revision/latest/scale-to-width-down/75?cb=20140330225706', level: 27 },
                
                // Row 2
                { name: 'Green Lure', url: 'https://static.wikia.nocookie.net/hayday/images/c/c4/Green_Lure.png/revision/latest/scale-to-width-down/75?cb=20140330225800', level: 27 },
                { name: 'Blue Lure', url: 'https://static.wikia.nocookie.net/hayday/images/1/12/Blue_Lure.png/revision/latest/scale-to-width-down/75?cb=20140330225859', level: 27 },
                { name: 'Purple Lure', url: 'https://static.wikia.nocookie.net/hayday/images/1/17/Purple_Lure.png/revision/latest/scale-to-width-down/75?cb=20140330225936', level: 27 },
                { name: 'Gold Lure', url: 'https://static.wikia.nocookie.net/hayday/images/a/a8/Gold_Lure.png/revision/latest/scale-to-width-down/75?cb=20140330230009', level: 27 },
                
                // Row 3
                { name: 'Apple Pie', url: 'https://static.wikia.nocookie.net/hayday/images/f/fb/Apple_Pie.png/revision/latest/scale-to-width-down/75?cb=20240207083954', level: 28 },
                { name: 'Fish Pie', url: 'https://static.wikia.nocookie.net/hayday/images/e/ec/Fish_Pie.png/revision/latest/scale-to-width-down/75?cb=20240207150258', level: 28 },
                { name: 'Apple Juice', url: 'https://static.wikia.nocookie.net/hayday/images/4/41/Apple_Juice.png/revision/latest/scale-to-width-down/75?cb=20240223064501', level: 28 },
                { name: 'Vanilla Ice Cream', url: 'https://static.wikia.nocookie.net/hayday/images/1/15/Vanilla_Ice_Cream.png/revision/latest/scale-to-width-down/75?cb=20240411152616', level: 29 },
                
                // Row 4
                { name: 'Roasted Tomatoes', url: 'https://static.wikia.nocookie.net/hayday/images/0/04/Roasted_Tomatoes.png/revision/latest/scale-to-width-down/75?cb=20191023233109', level: 30 },
                { name: 'Cherry Juice', url: 'https://static.wikia.nocookie.net/hayday/images/a/ab/Cherry_Juice.png/revision/latest/scale-to-width-down/75?cb=20240223064636', level: 30 },
                { name: 'Fishing Net', url: 'https://static.wikia.nocookie.net/hayday/images/a/a1/Fishing_Net.png/revision/latest/scale-to-width-down/75?cb=20150725033019', level: 30 },
                { name: 'Mystery Net', url: 'https://static.wikia.nocookie.net/hayday/images/1/17/Mystery_Net.png/revision/latest/scale-to-width-down/75?cb=20150725033113', level: 30 },
                
                // Row 5
                { name: 'Tomato Juice', url: 'https://static.wikia.nocookie.net/hayday/images/a/a5/Tomato_Juice.png/revision/latest/scale-to-width-down/75?cb=20240223064831', level: 31 },
                { name: 'Berry Juice', url: 'https://static.wikia.nocookie.net/hayday/images/3/3a/Berry_Juice.png/revision/latest/scale-to-width-down/75?cb=20240223063542', level: 31 },
                { name: 'Goat Feed', url: 'https://static.wikia.nocookie.net/hayday/images/e/ed/Goat_Feed.png/revision/latest/scale-to-width-down/75?cb=20150712161945', level: 32 },
                { name: 'Goat Cheese', url: 'https://static.wikia.nocookie.net/hayday/images/c/c8/Goat_Cheese.png/revision/latest/scale-to-width-down/75?cb=20240205163401', level: 33 },
                
                // Row 6
                { name: 'Pizza', url: 'https://static.wikia.nocookie.net/hayday/images/f/f4/Pizza.png/revision/latest/scale-to-width-down/75?cb=20240205074711', level: 33 },
                { name: 'Coal', url: 'https://static.wikia.nocookie.net/hayday/images/a/a7/Coal.png/revision/latest/scale-to-width-down/75?cb=20150711233731', level: 33 },
                { name: 'Refined Coal', url: 'https://static.wikia.nocookie.net/hayday/images/b/b5/Refined_Coal.png/revision/latest/scale-to-width-down/75?cb=20240208090929', level: 33 },
                { name: 'Cherry Popsicle', url: 'https://static.wikia.nocookie.net/hayday/images/4/48/Cherry_Popsicle.png/revision/latest/scale-to-width-down/75?cb=20240411152842', level: 33 },
                
                // Row 7
                { name: 'Feta Pie', url: 'https://static.wikia.nocookie.net/hayday/images/6/61/Feta_Pie.png/revision/latest/scale-to-width-down/75?cb=20240207150211', level: 34 },
                { name: 'Iron Ore', url: 'https://static.wikia.nocookie.net/hayday/images/8/87/Iron_Ore.png/revision/latest/scale-to-width-down/75?cb=20150711233632', level: 34 },
                { name: 'Iron Bar', url: 'https://static.wikia.nocookie.net/hayday/images/6/6c/Iron_Bar.png/revision/latest/scale-to-width-down/75?cb=20240208090640', level: 34 },
                { name: 'Strawberry Ice Cream', url: 'https://static.wikia.nocookie.net/hayday/images/8/8d/Strawberry_Ice_Cream.png/revision/latest/scale-to-width-down/75?cb=20240411152635', level: 34 },
                
                // Row 8
                { name: 'Wheat Bundle', url: 'https://static.wikia.nocookie.net/hayday/images/5/5d/Wheat_Bundle.png/revision/latest/scale-to-width-down/75?cb=20170707203212', level: 34 },
                { name: 'Meat Bucket', url: 'https://static.wikia.nocookie.net/hayday/images/5/5e/Meat_Bucket.png/revision/latest/scale-to-width-down/75?cb=20240411151118', level: 34 },
                { name: 'Strawberry Cake', url: 'https://static.wikia.nocookie.net/hayday/images/1/1a/Strawberry_Cake.png/revision/latest/scale-to-width-down/75?cb=20240223073929', level: 35 },
                { name: 'Baked Potato', url: 'https://static.wikia.nocookie.net/hayday/images/1/11/Baked_Potato.png/revision/latest/scale-to-width-down/75?cb=20240205164314', level: 35 },
                
                // Row 9
                { name: 'Apple Jam', url: 'https://static.wikia.nocookie.net/hayday/images/6/6c/Apple_Jam.png/revision/latest/scale-to-width-down/75?cb=20240208151258', level: 35 },
                { name: 'Chocolate Cake', url: 'https://static.wikia.nocookie.net/hayday/images/8/87/Chocolate_Cake.png/revision/latest/scale-to-width-down/75?cb=20240223074025', level: 36 },
                { name: 'Casserole', url: 'https://static.wikia.nocookie.net/hayday/images/b/b6/Casserole.png/revision/latest/scale-to-width-down/75?cb=20240207145740', level: 36 },
                { name: 'Raspberry Jam', url: 'https://static.wikia.nocookie.net/hayday/images/8/84/Raspberry_Jam.png/revision/latest/scale-to-width-down/75?cb=20240208151524', level: 36 },
                
                // Row 10
                { name: 'Spicy Pizza', url: 'https://static.wikia.nocookie.net/hayday/images/5/5c/Spicy_Pizza.png/revision/latest/scale-to-width-down/75?cb=20240205083244', level: 37 },
                { name: 'Blackberry Jam', url: 'https://static.wikia.nocookie.net/hayday/images/5/52/Blackberry_Jam.png/revision/latest/scale-to-width-down/75?cb=20240208151625', level: 37 },
                { name: 'Potato Feta Cake', url: 'https://static.wikia.nocookie.net/hayday/images/7/7c/Potato_Feta_Cake.png/revision/latest/scale-to-width-down/75?cb=20240223074133', level: 38 },
                { name: 'Cherry Jam', url: 'https://static.wikia.nocookie.net/hayday/images/5/53/Cherry_Jam.png/revision/latest/scale-to-width-down/75?cb=20240208151724', level: 38 },
                
                // Row 11
                { name: 'Bracelet', url: 'https://static.wikia.nocookie.net/hayday/images/3/33/Bracelet.png/revision/latest/scale-to-width-down/75?cb=20240208162033', level: 38 },
                { name: 'Potato Bread', url: 'https://static.wikia.nocookie.net/hayday/images/2/26/Potato_Bread.png/revision/latest/scale-to-width-down/75?cb=20240205083506', level: 39 },
                { name: 'Shepherd\'s Pie', url: 'https://static.wikia.nocookie.net/hayday/images/b/b8/Shepherd%27s_Pie.png/revision/latest/scale-to-width-down/75?cb=20240207150949', level: 39 },
                { name: 'Chocolate Ice Cream', url: 'https://static.wikia.nocookie.net/hayday/images/4/41/Chocolate_Ice_Cream.png/revision/latest/scale-to-width-down/75?cb=20240411152825', level: 39 },
                
                // Row 12
                { name: 'Necklace', url: 'https://static.wikia.nocookie.net/hayday/images/3/3a/Necklace.png/revision/latest/scale-to-width-down/75?cb=20240208162414', level: 39 },
                { name: 'Honey', url: 'https://static.wikia.nocookie.net/hayday/images/c/c6/Honey.png/revision/latest/scale-to-width-down/75?cb=20240209012557', level: 39 },
                { name: 'Honey Popcorn', url: 'https://static.wikia.nocookie.net/hayday/images/b/b1/Honey_Popcorn.png/revision/latest/scale-to-width-down/75?cb=20240206170401', level: 40 },
                { name: 'Diamond Ring', url: 'https://static.wikia.nocookie.net/hayday/images/a/a6/Diamond_Ring.png/revision/latest/scale-to-width-down/75?cb=20240208162131', level: 40 },
                
                // Row 13
                { name: 'Fish and Chips', url: 'https://static.wikia.nocookie.net/hayday/images/e/ea/Fish_and_Chips.png/revision/latest/scale-to-width-down/75?cb=20191023233220', level: 41 },
                { name: 'Iron Bracelet', url: 'https://static.wikia.nocookie.net/hayday/images/4/40/Iron_Bracelet.png/revision/latest/scale-to-width-down/75?cb=20240208162523', level: 41 },
                { name: 'Espresso', url: 'https://static.wikia.nocookie.net/hayday/images/a/ad/Espresso.png/revision/latest/scale-to-width-down/75?cb=20240209012756', level: 42 },
                { name: 'Honey Apple Cake', url: 'https://static.wikia.nocookie.net/hayday/images/1/16/Honey_Apple_Cake.png/revision/latest/scale-to-width-down/75?cb=20240223074318', level: 42 },
                
                // Row 14
                { name: 'Caffè Latte', url: 'https://static.wikia.nocookie.net/hayday/images/6/6e/Caff%C3%A8_Latte.png/revision/latest/scale-to-width-down/75?cb=20240209012944', level: 43 },
                { name: 'Chocolate Popcorn', url: 'https://static.wikia.nocookie.net/hayday/images/0/09/Chocolate_Popcorn.png/revision/latest/scale-to-width-down/75?cb=20240206170316', level: 44 },
                { name: 'Lobster Trap', url: 'https://static.wikia.nocookie.net/hayday/images/3/38/Lobster_Trap.png/revision/latest/scale-to-width-down/75?cb=20150725035512', level: 44 },
                { name: 'Frutti di Mare Pizza', url: 'https://static.wikia.nocookie.net/hayday/images/5/5f/Frutti_di_Mare_Pizza.png/revision/latest/scale-to-width-down/75?cb=20240205083710', level: 45 },
                
                // Row 15
                { name: 'Caffè Mocha', url: 'https://static.wikia.nocookie.net/hayday/images/c/c7/Caff%C3%A8_Mocha.png/revision/latest/scale-to-width-down/75?cb=20240209012852', level: 45 },
                { name: 'Soothing Pad', url: 'https://static.wikia.nocookie.net/hayday/images/c/c0/Soothing_Pad.png/revision/latest/scale-to-width-down/75?cb=20241209182716', level: 45 },
                { name: 'Raspberry Mocha', url: 'https://static.wikia.nocookie.net/hayday/images/5/5c/Raspberry_Mocha.png/revision/latest/scale-to-width-down/75?cb=20180223180014', level: 46 },
                { name: 'Lobster Soup', url: 'https://static.wikia.nocookie.net/hayday/images/5/59/Lobster_Soup.png/revision/latest/scale-to-width-down/75?cb=20240209021219', level: 46 },
                
                // Row 16
                { name: 'Hot Chocolate', url: 'https://static.wikia.nocookie.net/hayday/images/b/b0/Hot_Chocolate.png/revision/latest/scale-to-width-down/75?cb=20240209013139', level: 47 },
                { name: 'Tomato Soup', url: 'https://static.wikia.nocookie.net/hayday/images/d/dc/Tomato_Soup.png/revision/latest/scale-to-width-down/75?cb=20240209023225', level: 47 },
                { name: 'Red Scarf', url: 'https://static.wikia.nocookie.net/hayday/images/4/4f/Red_Scarf.png/revision/latest/scale-to-width-down/75?cb=20240207160030', level: 48 },
                { name: 'Lobster Skewer', url: 'https://static.wikia.nocookie.net/hayday/images/6/62/Lobster_Skewer.png/revision/latest/scale-to-width-down/75?cb=20240223075812', level: 48 },
                
                // Row 17
                { name: 'Beeswax', url: 'https://static.wikia.nocookie.net/hayday/images/e/e4/Beeswax.png/revision/latest/scale-to-width-down/75?cb=20240209012642', level: 48 },
                { name: 'Strawberry Candle', url: 'https://static.wikia.nocookie.net/hayday/images/2/21/Strawberry_Candle.png/revision/latest/scale-to-width-down/75?cb=20240209023413', level: 48 },
                { name: 'Pumpkin Soup', url: 'https://static.wikia.nocookie.net/hayday/images/5/59/Pumpkin_Soup.png/revision/latest/scale-to-width-down/75?cb=20240209023128', level: 49 },
                { name: 'Rustic Bouquet', url: 'https://static.wikia.nocookie.net/hayday/images/9/93/Rustic_Bouquet.png/revision/latest/scale-to-width-down/75?cb=20240209042055', level: 49 },
                
                // Row 18
                { name: 'Asparagus Quiche', url: 'https://static.wikia.nocookie.net/hayday/images/4/4b/Asparagus_Quiche.png/revision/latest/scale-to-width-down/75?cb=20240207145524', level: 49 },
                { name: 'Strawberry Jam', url: 'https://static.wikia.nocookie.net/hayday/images/4/40/Strawberry_Jam.png/revision/latest/scale-to-width-down/75?cb=20240208152746', level: 50 },
                { name: 'Duck Trap', url: 'https://static.wikia.nocookie.net/hayday/images/a/a7/Duck_Trap.png/revision/latest/scale-to-width-down/75?cb=20150725035639', level: 50 },
                { name: 'Sesame Ice Cream', url: 'https://static.wikia.nocookie.net/hayday/images/7/77/Sesame_Ice_Cream.png/revision/latest/scale-to-width-down/75?cb=20240208110210', level: 50 },
                
                // المستوى 51-75
                // Row 1
                { name: 'Caramel Apple', url: 'https://static.wikia.nocookie.net/hayday/images/2/24/Caramel_Apple.png/revision/latest/scale-to-width-down/75?cb=20240210053517', level: 51 },
                { name: 'Pillow', url: 'https://static.wikia.nocookie.net/hayday/images/3/36/Pillow.png/revision/latest/scale-to-width-down/75?cb=20240411151249', level: 51 },
                { name: 'Asparagus Soup', url: 'https://static.wikia.nocookie.net/hayday/images/8/83/Asparagus_Soup.png/revision/latest/scale-to-width-down/75?cb=20240209021345', level: 51 },
                { name: 'Toffee', url: 'https://static.wikia.nocookie.net/hayday/images/2/29/Toffee.png/revision/latest/scale-to-width-down/75?cb=20240210054552', level: 52 },
                
                // Row 2
                { name: 'Raspberry Candle', url: 'https://static.wikia.nocookie.net/hayday/images/6/6c/Raspberry_Candle.png/revision/latest/scale-to-width-down/75?cb=20180211175650', level: 52 },
                { name: 'Pineapple Juice', url: 'https://static.wikia.nocookie.net/hayday/images/f/fd/Pineapple_Juice.png/revision/latest/scale-to-width-down/75?cb=20240223064929', level: 52 },
                { name: 'Fish Soup', url: 'https://static.wikia.nocookie.net/hayday/images/b/be/Fish_Soup.png/revision/latest/scale-to-width-down/75?cb=20240209022047', level: 53 },
                { name: 'Soy Sauce', url: 'https://static.wikia.nocookie.net/hayday/images/9/97/Soy_Sauce.png/revision/latest/scale-to-width-down/75?cb=20240210055302', level: 54 },
                
                // Row 3
                { name: 'Chocolate', url: 'https://static.wikia.nocookie.net/hayday/images/d/df/Chocolate.png/revision/latest/scale-to-width-down/75?cb=20240210053728', level: 54 },
                { name: 'Fancy Cake', url: 'https://static.wikia.nocookie.net/hayday/images/d/dd/Fancy_Cake.png/revision/latest/scale-to-width-down/75?cb=20240411150410', level: 54 },
                { name: 'Sushi Roll', url: 'https://static.wikia.nocookie.net/hayday/images/c/cf/Sushi_Roll.png/revision/latest/scale-to-width-down/75?cb=20240210101804', level: 56 },
                { name: 'Lollipop', url: 'https://static.wikia.nocookie.net/hayday/images/5/58/Lollipop.png/revision/latest/scale-to-width-down/75?cb=20240210054240', level: 57 },
                
                // Row 4
                { name: 'Feta Salad', url: 'https://static.wikia.nocookie.net/hayday/images/9/96/Feta_Salad.png/revision/latest/scale-to-width-down/75?cb=20240211074202', level: 58 },
                { name: 'Lobster Sushi', url: 'https://static.wikia.nocookie.net/hayday/images/7/7b/Lobster_Sushi.png/revision/latest/scale-to-width-down/75?cb=20240210102040', level: 59 },
                { name: 'Blanket', url: 'https://static.wikia.nocookie.net/hayday/images/3/3b/Blanket.png/revision/latest/scale-to-width-down/75?cb=20240411145624', level: 59 },
                { name: 'Jelly Beans', url: 'https://static.wikia.nocookie.net/hayday/images/e/ed/Jelly_Beans.png/revision/latest/scale-to-width-down/75?cb=20240210054020', level: 60 },
                
                // Row 5
                { name: 'Olive Oil', url: 'https://static.wikia.nocookie.net/hayday/images/3/34/Olive_Oil.png/revision/latest/scale-to-width-down/75?cb=20240210055734', level: 60 },
                { name: 'Garlic Bread', url: 'https://static.wikia.nocookie.net/hayday/images/7/7f/Garlic_Bread.png/revision/latest/scale-to-width-down/75?cb=20240411150635', level: 60 },
                { name: 'Veggie Bagel', url: 'https://static.wikia.nocookie.net/hayday/images/1/14/Veggie_Bagel.png/revision/latest/scale-to-width-down/75?cb=20240211131010', level: 61 },
                { name: 'BLT Salad', url: 'https://static.wikia.nocookie.net/hayday/images/e/eb/BLT_Salad.png/revision/latest/scale-to-width-down/75?cb=20240211074418', level: 62 },
                
                // Row 6
                { name: 'Mayonnaise', url: 'https://static.wikia.nocookie.net/hayday/images/4/4e/Mayonnaise.png/revision/latest/scale-to-width-down/75?cb=20240210055543', level: 62 },
                { name: 'Caramel Latte', url: 'https://static.wikia.nocookie.net/hayday/images/6/6a/Caramel_Latte.png/revision/latest/scale-to-width-down/75?cb=20240209013040', level: 62 },
                { name: 'Egg Sushi', url: 'https://static.wikia.nocookie.net/hayday/images/9/9b/Egg_Sushi.png/revision/latest/scale-to-width-down/75?cb=20240210101954', level: 63 },
                { name: 'Honey Peanuts', url: 'https://static.wikia.nocookie.net/hayday/images/a/ad/Honey_Peanuts.png/revision/latest/scale-to-width-down/75?cb=20240411150946', level: 63 },
                
                // Row 7
                { name: 'Seafood Salad', url: 'https://static.wikia.nocookie.net/hayday/images/6/69/Seafood_Salad.png/revision/latest/scale-to-width-down/75?cb=20240211102556', level: 64 },
                { name: 'Berry Smoothie', url: 'https://static.wikia.nocookie.net/hayday/images/a/a8/Berry_Smoothie.png/revision/latest/scale-to-width-down/75?cb=20240211171218', level: 64 },
                { name: 'Snack Mix', url: 'https://static.wikia.nocookie.net/hayday/images/a/a3/Snack_Mix.png/revision/latest/scale-to-width-down/75?cb=20240411151336', level: 64 },
                { name: 'Bacon Toast', url: 'https://static.wikia.nocookie.net/hayday/images/7/72/Bacon_Toast.png/revision/latest/scale-to-width-down/75?cb=20150711224147', level: 65 },
                
                // Row 8
                { name: 'Bright Bouquet', url: 'https://static.wikia.nocookie.net/hayday/images/5/52/Bright_Bouquet.png/revision/latest/scale-to-width-down/75?cb=20240411145809', level: 65 },
                { name: 'Pineapple Cake', url: 'https://static.wikia.nocookie.net/hayday/images/e/e1/Pineapple_Cake.png/revision/latest/scale-to-width-down/75?cb=20240223074541', level: 65 },
                { name: 'Chocolate Pie', url: 'https://static.wikia.nocookie.net/hayday/images/7/7c/Chocolate_Pie.png/revision/latest/scale-to-width-down/75?cb=20240207145850', level: 65 },
                { name: 'Cabbage Soup', url: 'https://static.wikia.nocookie.net/hayday/images/3/34/Cabbage_Soup.png/revision/latest/scale-to-width-down/75?cb=20240209021929', level: 65 },
                
                // Row 9
                { name: 'Lemon Curd', url: 'https://static.wikia.nocookie.net/hayday/images/e/ea/Lemon_Curd.png/revision/latest/scale-to-width-down/75?cb=20240210055448', level: 66 },
                { name: 'Egg Sandwich', url: 'https://static.wikia.nocookie.net/hayday/images/8/81/Egg_Sandwich.png/revision/latest/scale-to-width-down/75?cb=20240211165444', level: 66 },
                { name: 'Green Smoothie', url: 'https://static.wikia.nocookie.net/hayday/images/f/f6/Green_Smoothie.png/revision/latest/scale-to-width-down/75?cb=20240211171507', level: 66 },
                { name: 'Olive Dip', url: 'https://static.wikia.nocookie.net/hayday/images/3/32/Olive_Dip.png/revision/latest/scale-to-width-down/75?cb=20240411151145', level: 66 },
                
                // Row 10
                { name: 'Fresh Pasta', url: 'https://static.wikia.nocookie.net/hayday/images/9/93/Fresh_Pasta.png/revision/latest/scale-to-width-down/75?cb=20240211172634', level: 67 },
                { name: 'Pasta Salad', url: 'https://static.wikia.nocookie.net/hayday/images/1/18/Pasta_Salad.png/revision/latest/scale-to-width-down/75?cb=20240211105704', level: 67 },
                { name: 'Lemon Pie', url: 'https://static.wikia.nocookie.net/hayday/images/8/85/Lemon_Pie.png/revision/latest/scale-to-width-down/75?cb=20240207150447', level: 67 },
                { name: 'Grilled Asparagus', url: 'https://static.wikia.nocookie.net/hayday/images/c/cf/Grilled_Asparagus.png/revision/latest/scale-to-width-down/75?cb=20240223080059', level: 67 },
                
                // Row 11
                { name: 'Grilled Onion', url: 'https://static.wikia.nocookie.net/hayday/images/7/70/Grilled_Onion.png/revision/latest/scale-to-width-down/75?cb=20191023233225', level: 68 },
                { name: 'Lemon Cake', url: 'https://static.wikia.nocookie.net/hayday/images/6/6c/Lemon_Cake.png/revision/latest/scale-to-width-down/75?cb=20240223074632', level: 68 },
                { name: 'Peanut Butter Milkshake', url: 'https://static.wikia.nocookie.net/hayday/images/b/b7/Peanut_Butter_Milkshake.png/revision/latest/scale-to-width-down/50?cb=20240303131045', level: 68 },
                { name: 'Tomato Sauce', url: 'https://static.wikia.nocookie.net/hayday/images/0/09/Tomato_Sauce.png/revision/latest/scale-to-width-down/75?cb=20240210060131', level: 68 },
                
                // Row 12
                { name: 'Lemon Essential Oil', url: 'https://static.wikia.nocookie.net/hayday/images/9/9a/Lemon_Essential_Oil.png/revision/latest/scale-to-width-down/75?cb=20240428095756', level: 68 },
                { name: 'Honey Toast', url: 'https://static.wikia.nocookie.net/hayday/images/6/6d/Honey_Toast.png/revision/latest/scale-to-width-down/75?cb=20240211164950', level: 69 },
                { name: 'Fried Rice', url: 'https://static.wikia.nocookie.net/hayday/images/6/61/Fried_Rice.png/revision/latest/scale-to-width-down/75?cb=20240411150556', level: 69 },
                { name: 'Yogurt Smoothie', url: 'https://static.wikia.nocookie.net/hayday/images/d/d2/Yogurt_Smoothie.png/revision/latest/scale-to-width-down/75?cb=20240211171944', level: 69 },
                
                // Row 13
                { name: 'Cloche Hat', url: 'https://static.wikia.nocookie.net/hayday/images/1/1e/Cloche_Hat.png/revision/latest/scale-to-width-down/75?cb=20180223175734', level: 70 },
                { name: 'Cucumber Smoothie', url: 'https://static.wikia.nocookie.net/hayday/images/5/57/Cucumber_Smoothie.png/revision/latest/scale-to-width-down/75?cb=20190129164559', level: 70 },
                { name: 'Orange Juice', url: 'https://static.wikia.nocookie.net/hayday/images/7/7e/Orange_Juice.png/revision/latest/scale-to-width-down/75?cb=20240223065838', level: 69 },
                { name: 'Flower Shawl', url: 'https://static.wikia.nocookie.net/hayday/images/6/66/Flower_Shawl.png/revision/latest/scale-to-width-down/75?cb=20240207160117', level: 69 },
                
                // Row 14
                { name: 'Peanut Butter and Jelly Sandwich', url: 'https://static.wikia.nocookie.net/hayday/images/6/69/Peanut_Butter_and_Jelly_Sandwich.png/revision/latest/scale-to-width-down/75?cb=20240411151207', level: 71 },
                { name: 'Onion Soup', url: 'https://static.wikia.nocookie.net/hayday/images/0/05/Onion_Soup.png/revision/latest/scale-to-width-down/75?cb=20240209022621', level: 71 },
                { name: 'Lemon Candle', url: 'https://static.wikia.nocookie.net/hayday/images/8/8a/Lemon_Candle.png/revision/latest/scale-to-width-down/75?cb=20240209023630', level: 70 },
                { name: 'Top Hat', url: 'https://static.wikia.nocookie.net/hayday/images/8/8d/Top_Hat.png/revision/latest/scale-to-width-down/75?cb=20240211173933', level: 70 },
                
                // Row 15
                { name: 'Gnocchi', url: 'https://static.wikia.nocookie.net/hayday/images/8/81/Gnocchi.png/revision/latest/scale-to-width-down/75?cb=20240211175230', level: 72 },
                { name: 'Winter Veggies', url: 'https://static.wikia.nocookie.net/hayday/images/0/08/Winter_Veggies.png/revision/latest/scale-to-width-down/75?cb=20240411151607', level: 72 },
                { name: 'Noodle Soup', url: 'https://static.wikia.nocookie.net/hayday/images/8/86/Noodle_Soup.png/revision/latest/scale-to-width-down/75?cb=20240209022516', level: 71 },
                { name: 'Rice Noodles', url: 'https://static.wikia.nocookie.net/hayday/images/2/20/Rice_Noodles.png/revision/latest/scale-to-width-down/75?cb=20240211172740', level: 71 },
                
                // Row 16
                { name: 'Gracious Bouquet', url: 'https://static.wikia.nocookie.net/hayday/images/8/82/Gracious_Bouquet.png/revision/latest/scale-to-width-down/75?cb=20240411150713', level: 73 },
                { name: 'Marmalade', url: 'https://static.wikia.nocookie.net/hayday/images/e/ed/Marmalade.png/revision/latest/scale-to-width-down/75?cb=20240208152141', level: 73 },
                { name: 'Sun Hat', url: 'https://static.wikia.nocookie.net/hayday/images/4/4c/Sun_Hat.png/revision/latest/scale-to-width-down/75?cb=20240211173826', level: 72 },
                { name: 'Veggie Lasagna', url: 'https://static.wikia.nocookie.net/hayday/images/d/d1/Veggie_Lasagna.png/revision/latest/scale-to-width-down/75?cb=20240211180053', level: 72 },
                
                // Row 17
                { name: 'Veggie Platter', url: 'https://static.wikia.nocookie.net/hayday/images/7/7d/Veggie_Platter.png/revision/latest/scale-to-width-down/75?cb=20240211105316', level: 74 },
                { name: 'Chamomile Essential Oil', url: 'https://static.wikia.nocookie.net/hayday/images/5/53/Chamomile_Essential_Oil.png/revision/latest/scale-to-width-down/60?cb=20241209181229', level: 74 },
                { name: 'Hot Dog', url: 'https://static.wikia.nocookie.net/hayday/images/8/82/Hot_Dog.png/revision/latest/scale-to-width-down/75?cb=20240211180755', level: 73 },
                { name: 'Coleslaw', url: 'https://static.wikia.nocookie.net/hayday/images/e/e1/Coleslaw.png/revision/latest/scale-to-width-down/75?cb=20240411150158', level: 73 },
                
                // Row 18
                { name: 'Cotton Candy', url: 'https://static.wikia.nocookie.net/hayday/images/6/67/Cotton_Candy.png/revision/latest/scale-to-width-down/75?cb=20240210053918', level: 75 },
                
                
                // المستوى 76-100
                // Row 1
                { name: 'Peach Tart', url: 'https://static.wikia.nocookie.net/hayday/images/0/07/Peach_Tart.png/revision/latest/scale-to-width-down/75?cb=20240207150814', level: 76 },
                { name: 'Big Sushi Roll', url: 'https://static.wikia.nocookie.net/hayday/images/a/a9/Big_Sushi_Roll.png/revision/latest/scale-to-width-down/75?cb=20240210101848', level: 76 },
                { name: 'Tofu Dog', url: 'https://static.wikia.nocookie.net/hayday/images/f/fa/Tofu_Dog.png/revision/latest/scale-to-width-down/75?cb=20180222234446', level: 76 },
                { name: 'Beetroot Salad', url: 'https://static.wikia.nocookie.net/hayday/images/f/ff/Beetroot_Salad.png/revision/latest/scale-to-width-down/75?cb=20240411145459', level: 76 },
                
                // Row 2
                { name: 'Plain Donut', url: 'https://static.wikia.nocookie.net/hayday/images/0/08/Plain_Donut.png/revision/latest/scale-to-width-down/75?cb=20240212101437', level: 76 },
                { name: 'Salsa', url: 'https://static.wikia.nocookie.net/hayday/images/1/1e/Salsa.png/revision/latest/scale-to-width-down/75?cb=20240210055852', level: 77 },
                { name: 'Taco', url: 'https://static.wikia.nocookie.net/hayday/images/4/4d/Taco.png/revision/latest/scale-to-width-down/75?cb=20240212102658', level: 77 },
                { name: 'Colourful Omelet', url: 'https://static.wikia.nocookie.net/hayday/images/6/65/Colourful_Omelet.png/revision/latest/scale-to-width-down/75?cb=20240212104001', level: 77 },
                
                // Row 3
                { name: 'Spring Omelet', url: 'https://static.wikia.nocookie.net/hayday/images/f/f2/Spring_Omelet.png/revision/latest/scale-to-width-down/75?cb=20240212104155', level: 77 },
                { name: 'Orange Sorbet', url: 'https://static.wikia.nocookie.net/hayday/images/1/11/Orange_Sorbet.png/revision/latest/scale-to-width-down/75?cb=20240411152737', level: 78 },
                { name: 'Corn Dog', url: 'https://static.wikia.nocookie.net/hayday/images/1/15/Corn_Dog.png/revision/latest/scale-to-width-down/75?cb=20240211180913', level: 78 },
                { name: 'Potato Soup', url: 'https://static.wikia.nocookie.net/hayday/images/a/ab/Potato_Soup.png/revision/latest/scale-to-width-down/75?cb=20240303134341', level: 78 },
                
                // Row 4
                { name: 'Summer Rolls', url: 'https://static.wikia.nocookie.net/hayday/images/7/74/Summer_Rolls.png/revision/latest/scale-to-width-down/75?cb=20240211110030', level: 78 },
                { name: 'Sesame Brittle', url: 'https://static.wikia.nocookie.net/hayday/images/6/65/Sesame_Brittle.png/revision/latest/scale-to-width-down/75?cb=20240210054437', level: 78 },
                { name: 'Affogato', url: 'https://static.wikia.nocookie.net/hayday/images/f/fc/Affogato.png/revision/latest/scale-to-width-down/75?cb=20240208103914', level: 78 },
                { name: 'Fish Taco', url: 'https://static.wikia.nocookie.net/hayday/images/d/d5/Fish_Taco.png/revision/latest/scale-to-width-down/75?cb=20240212102746', level: 79 },
                
                // Row 5
                { name: 'Peach Jam', url: 'https://static.wikia.nocookie.net/hayday/images/b/be/Peach_Jam.png/revision/latest/scale-to-width-down/75?cb=20240208152501', level: 79 },
                { name: 'Lobster Pasta', url: 'https://static.wikia.nocookie.net/hayday/images/5/5a/Lobster_Pasta.png/revision/latest/scale-to-width-down/75?cb=20240211175632', level: 79 },
                { name: 'Cucumber Sandwich', url: 'https://static.wikia.nocookie.net/hayday/images/b/b4/Cucumber_Sandwich.png/revision/latest/scale-to-width-down/75?cb=20240211170159', level: 79 },
                { name: 'Spicy Fish', url: 'https://static.wikia.nocookie.net/hayday/images/7/71/Spicy_Fish.png/revision/latest/scale-to-width-down/75?cb=20240411151355', level: 79 },
                
                // Row 6
                { name: 'Sprinkled Donut', url: 'https://static.wikia.nocookie.net/hayday/images/4/40/Sprinkled_Donut.png/revision/latest/scale-to-width-down/75?cb=20240212101844', level: 79 },
                { name: 'Cheese Omelet', url: 'https://static.wikia.nocookie.net/hayday/images/c/c2/Cheese_Omelet.png/revision/latest/scale-to-width-down/75?cb=20240212103833', level: 79 },
                { name: 'Green Tea', url: 'https://static.wikia.nocookie.net/hayday/images/8/8f/Green_Tea.png/revision/latest/scale-to-width-down/75?cb=20240212110927', level: 80 },
                { name: 'Onion Dog', url: 'https://static.wikia.nocookie.net/hayday/images/e/e8/Onion_Dog.png/revision/latest/scale-to-width-down/75?cb=20240211181128', level: 80 },
                
                // Row 7
                { name: 'Stuffed Peppers', url: 'https://static.wikia.nocookie.net/hayday/images/0/06/Stuffed_Peppers.png/revision/latest/scale-to-width-down/75?cb=20240411151408', level: 80 },
                { name: 'Fresh Diffuser', url: 'https://static.wikia.nocookie.net/hayday/images/2/2f/Fresh_Diffuser.png/revision/latest/scale-to-width-down/50?cb=20241209194636', level: 110 },
                { name: 'Rice Ball', url: 'https://static.wikia.nocookie.net/hayday/images/1/1d/Rice_Ball.png/revision/latest/scale-to-width-down/75?cb=20210907213244', level: 110 },
                { name: 'Guava Cupcake', url: 'https://static.wikia.nocookie.net/hayday/images/9/9e/Guava_Cupcake.png/revision/latest/scale-to-width-down/75?cb=20240411150749', level: 109 },
                { name: 'Peanut Fudge', url: 'https://static.wikia.nocookie.net/hayday/images/2/2d/Peanut_Fudge.png/revision/latest/scale-to-width-down/75?cb=20220428150457', level: 111 },
                
                // Row 8
                { name: 'Winter Stew', url: 'https://static.wikia.nocookie.net/hayday/images/e/e3/Winter_Stew.png/revision/latest/scale-to-width-down/75?cb=20240411151558', level: 112 },
                { name: 'Tropical Cupcake', url: 'https://static.wikia.nocookie.net/hayday/images/9/9b/Tropical_Cupcake.png/revision/latest/scale-to-width-down/75?cb=20240411151452', level: 112 },
                { name: 'Zesty Perfume', url: 'https://static.wikia.nocookie.net/hayday/images/a/ac/Zesty_Perfume.png/revision/latest/scale-to-width-down/50?cb=20241209193805', level: 111 },
                { name: 'Cookie Cupcake', url: 'https://static.wikia.nocookie.net/hayday/images/8/86/Cookie_Cupcake.png/revision/latest/scale-to-width-down/75?cb=20250112061229', level: 111 },
                { name: 'Calming Diffuser', url: 'https://static.wikia.nocookie.net/hayday/images/d/d3/Calming_Diffuser.png/revision/latest/scale-to-width-down/50?cb=20241209194317', level: 116 },
                { name: 'Orange Salad', url: 'https://static.wikia.nocookie.net/hayday/images/b/bb/Orange_Salad.png/revision/latest/scale-to-width-down/75?cb=20240211105603', level: 117 },
                
                // Row 10
                { name: 'Chocolate Waffles', url: 'https://static.wikia.nocookie.net/hayday/images/4/4d/Chocolate_Waffles.png/revision/latest/scale-to-width-down/75?cb=20240217133520', level: 117 },
                { name: 'Breakfast Waffles', url: 'https://static.wikia.nocookie.net/hayday/images/5/59/Breakfast_Waffles.png/revision/latest/scale-to-width-down/75?cb=20240217133249', level: 119 },
                { name: 'Breakfast Bowl', url: 'https://static.wikia.nocookie.net/hayday/images/2/2e/Breakfast_Bowl.png/revision/latest/scale-to-width-down/75?cb=20240411145742', level: 119 },
                { name: 'Apple Porridge', url: 'https://static.wikia.nocookie.net/hayday/images/d/d3/Apple_Porridge.png/revision/latest/scale-to-width-down/75?cb=20240217161228', level: 119 },
                
                // Row 11
                { name: 'Pineapple Coconut Bars', url: 'https://static.wikia.nocookie.net/hayday/images/6/61/Pineapple_Coconut_Bars.png/revision/latest/scale-to-width-down/75?cb=20240205084133', level: 120 },
                { name: 'Sweet Porridge', url: 'https://static.wikia.nocookie.net/hayday/images/f/fb/Sweet_Porridge.png/revision/latest/scale-to-width-down/75?cb=20240217161407', level: 120 },
                { name: 'Rich Soap', url: 'https://static.wikia.nocookie.net/hayday/images/2/2e/Rich_Soap.png/revision/latest/scale-to-width-down/75?cb=20240212124127', level: 121 },
                { name: 'Fresh Porridge', url: 'https://static.wikia.nocookie.net/hayday/images/0/09/Fresh_Porridge.png/revision/latest/scale-to-width-down/75?cb=20240217161318', level: 122 },
                
                // Row 12
                { name: 'Vanilla Milkshake', url: 'https://static.wikia.nocookie.net/hayday/images/1/14/Vanilla_Milkshake.png/revision/latest/scale-to-width-down/75?cb=20240217094936', level: 124 },
                { name: 'Mocha Milkshake', url: 'https://static.wikia.nocookie.net/hayday/images/7/7d/Mocha_Milkshake.png/revision/latest/scale-to-width-down/75?cb=20240217095145', level: 125 },
                
                
                // المستوى 126-150
                // Row 1
                { name: 'Fruity Milkshake', url: 'https://static.wikia.nocookie.net/hayday/images/f/fb/Fruity_Milkshake.png/revision/latest/scale-to-width-down/75?cb=20240217095037', level: 126 },
                
            ];
            
            // تمكين العلم الذي يشير إلى أن المنتجات تم تحميلها
            productsLoaded = true;

            // عرض رسالة نجاح
            statusMessage.textContent = `تم جلب ${productImages.length} منتج بنجاح. انقر على أحد أقسام المستويات لعرض المنتجات.`;
            statusMessage.style.color = '#2ecc71';
            setTimeout(() => {
                statusMessage.style.color = '';
            }, 3000);
            
        } catch (error) {
            console.error('Error fetching product images:', error);
            statusMessage.textContent = 'حدث خطأ أثناء جلب صور المنتجات';
            statusMessage.style.color = '#e74c3c';
        } finally {
            // إخفاء مؤشر التحميل وإعادة تفعيل الزر
            loadingSpinner.classList.add('hidden');
            fetchImagesBtn.disabled = false;
        }
    }
    
    // دالة إنشاء بطاقة عرض للصورة
    function createImageCard(productData) {
        // إنشاء حاوية البطاقة بالكامل
        const cardContainer = document.createElement('div');
        cardContainer.className = 'product-container';

        // إنشاء الجزء الرئيسي من البطاقة
        const card = document.createElement('div');
        card.className = 'product-item';
        card.setAttribute('data-product-id', productData.id);
        
        // إنشاء صورة المنتج
        const img = document.createElement('img');
        img.src = productData.url;
        img.alt = productData.name;
        img.loading = 'lazy'; // تحميل الصور بشكل تدريجي
        
        // إنشاء اسم المنتج
        const nameDiv = document.createElement('div');
        nameDiv.className = 'product-name';
        nameDiv.textContent = productData.name;
        
        // استخدام مستوى المنتج من بيانات المنتج مباشرة
        let level = productData.level || '?';
        
        // إنشاء مستوى المنتج
        const levelDiv = document.createElement('div');
        levelDiv.className = 'product-level';
        levelDiv.textContent = 'Level ' + level;
        
        // إضافة زر التحميل
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'تحميل';
        downloadBtn.onclick = (e) => {
            e.stopPropagation(); // منع انتشار الحدث
            downloadImage(productData.url, productData.name);
        };
        
        // إنشاء منطقة التفاصيل الموسعة
        const expandedDetails = document.createElement('div');
        expandedDetails.className = 'product-details';
        expandedDetails.innerHTML = `
            <div class="details-content">
                <div class="details-row">
                    <strong>اسم المنتج:</strong> ${productData.name}
                </div>
                <div class="details-row">
                    <strong>المستوى المطلوب:</strong> ${level}
                </div>
                <div class="details-row">
                    <strong>رابط الصورة:</strong> <a href="${productData.url}" target="_blank">فتح الصورة</a>
                </div>
            </div>
        `;
        
        // إضافة العناصر إلى البطاقة
        card.appendChild(img);
        card.appendChild(nameDiv);
        card.appendChild(levelDiv);
        card.appendChild(downloadBtn);
        
        // إضافة حدث النقر لتوسيع/طي التفاصيل
        card.addEventListener('click', function() {
            // إذا كانت التفاصيل مخفية، أظهرها
            if (!cardContainer.classList.contains('expanded')) {
                // إغلاق جميع البطاقات المفتوحة الأخرى
                document.querySelectorAll('.product-container.expanded').forEach(container => {
                    if (container !== cardContainer) {
                        container.classList.remove('expanded');
                        container.querySelector('.product-details').style.maxHeight = '0';
                    }
                });
                
                // فتح هذه البطاقة
                cardContainer.classList.add('expanded');
                expandedDetails.style.maxHeight = expandedDetails.scrollHeight + 'px';
            } else {
                // إذا كانت مفتوحة، أغلقها
                cardContainer.classList.remove('expanded');
                expandedDetails.style.maxHeight = '0';
            }
        });
        
        // إضافة البطاقة والتفاصيل إلى الحاوية
        cardContainer.appendChild(card);
        cardContainer.appendChild(expandedDetails);
        
        return cardContainer;
    }
    
    // دالة تحميل صورة واحدة
    function downloadImage(url, fileName) {
        // إظهار رسالة التحميل
        statusMessage.textContent = `جاري تحميل ${fileName}...`;
        statusMessage.style.color = '#3498db';
        
        // تحويل الرابط للتأكد من أنه لا يحتوي على معلمات منع التحميل
        // إزالة المعلمات مثل ?cb=XXXXXX التي قد تمنع التحميل
        const cleanUrl = url.split('?')[0];
        
        // استخدام fetch لجلب الصورة كبيانات blob
        fetch(cleanUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`فشل تحميل الصورة: ${response.statusText}`);
                }
                return response.blob();
            })
            .then(blob => {
                // إنشاء URL مؤقت للبيانات
                const blobUrl = URL.createObjectURL(blob);
                
                // إنشاء عنصر رابط للتحميل
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                document.body.appendChild(link);
                link.click();
                
                // تنظيف الموارد
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                    statusMessage.textContent = `تم تحميل ${fileName} بنجاح!`;
                    statusMessage.style.color = '#2ecc71';
                    setTimeout(() => {
                        statusMessage.style.color = '';
                    }, 2000);
                }, 100);
            })
            .catch(error => {
                console.error('Error downloading image:', error);
                statusMessage.textContent = `فشل تحميل الصورة: ${error.message}`;
                statusMessage.style.color = '#e74c3c';
                setTimeout(() => {
                    statusMessage.style.color = '';
                }, 3000);
            });
    }
    

    
    // إظهار رسالة ترحيبية
    statusMessage.textContent = 'انقر على زر "جلب صور المنتجات" للبدء.';
    
    // دالة تصفية المنتجات حسب نطاق المستوى
    function filterProductsByLevel(minLevel, maxLevel) {
        // إيجاد جميع حاويات الأقسام وإخفاءها
        sectionContents.forEach(container => {
            container.innerHTML = '';
            container.classList.remove('active');
        });
        
        // تصفية المنتجات حسب نطاق المستوى
        const filteredProducts = productImages.filter(product => 
            product.level >= minLevel && product.level <= maxLevel
        );
        
        // إيجاد حاوية القسم المناسب
        let targetContainer = null;
        sectionContents.forEach(container => {
            const containerId = container.id;
            if (containerId === `level-${minLevel}-${maxLevel}`) {
                targetContainer = container;
                container.classList.add('active');
            }
        });
        
        // التحقق من وجود الحاوية المناسبة
        if (!targetContainer) {
            console.error(`لم يتم العثور على حاوية القسم للمستويات ${minLevel}-${maxLevel}`);
            return;
        }
        
        console.log(`تمت تصفية ${filteredProducts.length} منتجات للمستويات ${minLevel}-${maxLevel}`);
        
        // إنشاء بطاقات للمنتجات المصفاة وإضافتها إلى الحاوية المناسبة
        filteredProducts.forEach(product => {
            const imageCard = createImageCard(product);
            targetContainer.appendChild(imageCard);
        });
        
        // تحديث رسالة الحالة
        statusMessage.textContent = `تم عرض ${filteredProducts.length} منتجًا من المستوى ${minLevel} إلى ${maxLevel}.`;
    }
    
    // إضافة مستمعي الأحداث لأزرار المستويات
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الفئة النشطة من جميع الأزرار
            levelButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر المحدد
            button.classList.add('active');
            
            // الحصول على نطاق المستوى من سمات البيانات
            const minLevel = parseInt(button.dataset.minLevel);
            const maxLevel = parseInt(button.dataset.maxLevel);
            
            // تصفية وعرض المنتجات حسب نطاق المستوى
            filterProductsByLevel(minLevel, maxLevel);
        });
    });
});
