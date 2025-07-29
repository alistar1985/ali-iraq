document.addEventListener('DOMContentLoaded', function() {
    // عناصر واجهة المستخدم
    const fetchImagesBtn = document.getElementById('fetch-images-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const statusMessage = document.getElementById('status-message');
    const sectionHeaders = document.querySelectorAll('.section-header');
    const sectionContents = document.querySelectorAll('.section-content');
    const loadingSpinner = document.getElementById('loading-spinner');
    const downloadProgress = document.getElementById('download-progress');
    const progressBar = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const levelButtons = document.querySelectorAll('.section-header'); // أزرار المستويات
    
    // مصفوفة لتخزين بيانات الصور
    let productImages = [];
    let productsLoaded = false; // لتتبع ما إذا تم تحميل المنتجات بالفعل
    
    // عنوان صفحة منتجات Hay Day
    const productPageUrl = 'https://hayday.fandom.com/wiki/Products';
    
    // إضافة مستمعي الأحداث للأزرار
    fetchImagesBtn.addEventListener('click', fetchProductImages);
    downloadAllBtn.addEventListener('click', downloadAllImages);
    
    // إضافة مستمع الحدث لزر المنتج النادر
    const rareProductBtn = document.getElementById('rare-product-btn');
    rareProductBtn.addEventListener('click', downloadRareProduct);
    
    // تحميل المنتجات تلقائياً عند تحميل الصفحة
    fetchProductImages();
    
    // إضافة مستمعي الأحداث لرؤوس الأقسام
    sectionHeaders.forEach(header => {
        header.addEventListener('click', async function(event) {
            event.preventDefault();
            
            // تحميل الصور إذا لم تكن محملة
            if (!productsLoaded) {
                statusMessage.textContent = 'جاري جلب صور المنتجات تلقائياً...';
                await fetchProductImages();
                if (!productsLoaded) {
                    statusMessage.textContent = 'فشل جلب صور المنتجات. حاول مرة أخرى.';
                    statusMessage.style.color = '#e74c3c';
                    setTimeout(() => statusMessage.style.color = '', 2000);
                    return;
                }
            }
            
            const minLevel = parseInt(this.getAttribute('data-min-level'));
            const maxLevel = parseInt(this.getAttribute('data-max-level'));
            const sectionContent = this.nextElementSibling;
            const wasActive = this.classList.contains('active');
            
            // إغلاق جميع الأقسام
            sectionHeaders.forEach(h => h.classList.remove('active'));
            sectionContents.forEach(c => c.classList.remove('active'));
            
            // إذا لم يكن القسم نشطاً من قبل، افتحه
            if (!wasActive) {
                this.classList.add('active');
                sectionContent.classList.add('active');
                
                // تحميل المنتجات فقط إذا كان القسم فارغاً
                if (sectionContent.children.length === 0) {
                    displayProductsByLevel(minLevel, maxLevel, sectionContent);
                }
                
                statusMessage.textContent = `تم عرض منتجات المستوى ${minLevel} - ${maxLevel}.`;
                statusMessage.style.color = '#2ecc71';
            } else {
                // إذا كان القسم مفتوحًا بالفعل، أعد إضافة فئة 'active' لإبقائه مفتوحًا
                this.classList.add('active');
                sectionContent.classList.add('active');
                // لا تقم بتغيير رسالة الحالة، أو يمكنك إضافة رسالة تفيد بأن القسم مفتوح بالفعل
                statusMessage.textContent = `منتجات المستوى ${minLevel} - ${maxLevel} معروضة بالفعل.`;
                statusMessage.style.color = '#3498db';
            }
            
            setTimeout(() => statusMessage.style.color = '', 2000);
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
                { name: 'Bread', arabicName: 'خبز', url: './images/products/1-25/2_bread.png', level: 2 },
                { name: 'Chicken Feed', arabicName: 'علف دجاج', url: './images/products/1-25/3_chicken_feed.png', level: 3 },
                { name: 'Cow Feed', arabicName: 'علف بقر', url: './images/products/1-25/6_cow_feed.png', level: 6 },
                { name: 'Cream', arabicName: 'كريمة', url: './images/products/1-25/6_cream.png', level: 6 },
                
                // Row 2
                { name: 'Corn Bread', arabicName: 'خبز ذرة', url: './images/products/1-25/7_corn_bread.png', level: 7 },
                { name: 'Brown Sugar', arabicName: 'سكر بني', url: './images/products/1-25/7_brown_sugar.png', level: 7 },
                { name: 'Popcorn', arabicName: 'فشار', url: './images/products/1-25/8_popcorn.png', level: 8 },
                { name: 'Butter', arabicName: 'زبدة', url: './images/products/1-25/9_butter.png', level: 9 },
                
                // Row 3
                { name: 'Pig Feed', arabicName: 'علف خنزير', url: './images/products/1-25/10_pig_feed.png', level: 10 },
                { name: 'Cookie', arabicName: 'كوكيز', url: './images/products/1-25/10_cookie.png', level: 10 },
                { name: 'Bacon and Eggs', arabicName: 'بيض مقلي مع لحم', url: './images/products/1-25/11_bacon_and_eggs.png', level: 11 },
                
                // Row 4
                { name: 'Cheese', arabicName: 'جبن', url: './images/products/1-25/12_cheese.png', level: 12 },
                { name: 'White Sugar', arabicName: 'سكر أبيض', url: './images/products/1-25/13_white_sugar.png', level: 13 },
                { name: 'Carrot Pie', arabicName: 'فطيرة جزر', url: './images/products/1-25/14_carrot_pie.png', level: 14 },
                { name: 'Pumpkin Pie', arabicName: 'فطيرة قرع', url: './images/products/1-25/15_pumpkin_pie.png', level: 15 },
                
                // Row 5
                { name: 'Sheep Feed', arabicName: 'علف غنم', url: './images/products/1-25/16_sheep_feed.png', level: 16 },
                { name: 'Buttered Popcorn', arabicName: 'فشار بالزبدة', url: './images/products/1-25/16_buttered_popcorn.png', level: 16 },
                { name: 'Sweater', arabicName: 'سترة', url: './images/products/1-25/17_sweater.png', level: 17 },
                { name: 'Bacon Pie', arabicName: 'فطيرة باللحم', url: './images/products/1-25/18_bacon_pie.png', level: 18 },
                
                // Row 6
                { name: 'Syrup', arabicName: 'شراب', url: './images/products/1-25/18_syrup.png', level: 18 },
                { name: 'Cotton Fabric', arabicName: 'نسيح القطن ', url: './images/products/1-25/18_cotton_fabric.png', level: 18 },
                { name: 'Hamburger', arabicName: 'همبرغر', url: './images/products/1-25/18_hamburger.png', level: 18 },
                { name: 'Raspberry Muffin', arabicName: 'كعكة توت العليق', url: './images/products/1-25/19_raspberry_muffin.png', level: 19 },
                
                // Row 7
                { name: 'Blue Woolly Hat', arabicName: 'قبعة صصوف زرقاء', url: './images/products/1-25/19_blue_woolly_hat.png', level: 19 },
                { name: 'Cotton Shirt', arabicName: 'قميص قطني', url: './images/products/1-25/19_cotton_shirt.png', level: 19 },
                { name: 'Blue Sweater', arabicName: 'سترة زرقاء', url: './images/products/1-25/20_blue_sweater.png', level: 20 },
                { name: 'Carrot Cake', arabicName: 'كيكة جزر', url: './images/products/1-25/21_carrot_cake.png', level: 21 },
                
                // Row 8
                { name: 'Wooly Chaps', arabicName: 'سروال صوف', url: './images/products/1-25/21_wooly_chaps.png', level: 21 },
                { name: 'Cream Cake', arabicName: 'كيكة كريمة', url: './images/products/1-25/23_cream_cake.png', level: 23 },
                { name: 'Red Berry Cake', arabicName: 'كيكة التوت الأحمر', url: './images/products/1-25/23_red_berry_cake.png', level: 23 },
                { name: 'Cheesecake', arabicName: ' كعكة الجبن', url: './images/products/1-25/24_cheesecake.png', level: 24 },
                
                // Row 9
                { name: 'Silver Ore', arabicName: 'خام الفضة', url: './images/products/1-25/24_silver_ore.png', level: 24 },
                { name: 'Gold Ore', arabicName: 'خام الذهب', url: './images/products/1-25/24_gold_ore.png', level: 24 },
                { name: 'Platinum Ore', arabicName: 'خام البلاتين', url: './images/products/1-25/24_platinum_ore.png', level: 24 },
                { name: 'Silver Bar', arabicName: 'سبيكة فضة', url: './images/products/1-25/24_silver_bar.png', level: 24 },
                
                // Row 10
                { name: 'Chili Popcorn', arabicName: 'فشار حار', url: './images/products/1-25/25_chili_popcorn.png', level: 25 },
                { name: 'Gold Bar', arabicName: 'سبيكة ذهب', url: './images/products/1-25/25_gold_bar.png', level: 25 },
                { name: 'Platinum Bar', arabicName: 'سبيكة بلاتين', url: './images/products/1-25/25_platinum_bar.png', level: 25 },
                { name: 'Violet Dress', arabicName: 'فستان بنفسجي', url: './images/products/1-25/25_violet_dress.png', level: 25 },
                
                // المستوى 26-50
                // Row 1
                { name: 'Blackberry Muffin', arabicName: 'كعكة توت العليق', url: './images/products/26-50/26_blackberry_muffin.png', level: 26 },
                { name: 'Carrot Juice', arabicName: 'عصير جزر', url: './images/products/26-50/26_carrot_juice.png', level: 26 },
                { name: 'Fish Burger', arabicName: 'برغر السمك', url: './images/products/26-50/27_fish_burger.png', level: 27 },
                { name: 'Red Lure', arabicName: 'الطعم الأحمر', url: './images/products/26-50/27_red_lure.png', level: 27 },
                
                // Row 2
                { name: 'Green Lure', arabicName: 'الطعم الأخضر', url: './images/products/26-50/27_green_lure.png', level: 27 },
                { name: 'Blue Lure', arabicName: 'الطعم أزرق', url: './images/products/26-50/27_blue_lure.png', level: 27 },
                { name: 'Purple Lure', arabicName: 'الطعم البنفسجي', url: './images/products/26-50/27_purple_lure.png', level: 27 },
                { name: 'Gold Lure', arabicName: 'الطعم الذهبي', url: './images/products/26-50/27_gold_lure.png', level: 27 },
                
                // Row 3
                { name: 'Apple Pie', arabicName: 'فطيرة تفاح', url: './images/products/26-50/28_apple_pie.png', level: 28 },
                { name: 'Fish Pie', arabicName: 'فطيرة سمك', url: './images/products/26-50/28_fish_pie.png', level: 28 },
                { name: 'Apple Juice', arabicName: 'عصير تفاح', url: './images/products/26-50/28_apple_juice.png', level: 28 },
                { name: 'Vanilla Ice Cream', arabicName: 'مثلجات الفانيليا', url: './images/products/26-50/29_vanilla_ice_cream.png', level: 29 },
                
                // Row 4
                { name: 'Roasted Tomatoes', arabicName: 'طماطم مشوية', url: './images/products/26-50/30_roasted_tomatoes.png', level: 30 },
                { name: 'Cherry Juice', arabicName: 'عصير كرز', url: './images/products/26-50/30_cherry_juice.png', level: 30 },
                { name: 'Fishing Net', arabicName: 'شبكة الصيد', url: './images/products/26-50/30_fishing_net.png', level: 30 },
                { name: 'Mystery Net', arabicName: 'شبكة الغموض', url: './images/products/26-50/30_mystery_net.png', level: 30 },
                
                // Row 5
                { name: 'Tomato Juice', arabicName: 'عصير طماطم', url: './images/products/26-50/31_tomato_juice.png', level: 31 },
                { name: 'Berry Juice', arabicName: 'عصير توت', url: './images/products/26-50/31_berry_juice.png', level: 31 },
                { name: 'Goat Feed', arabicName: 'علف ماعز', url: './images/products/26-50/32_goat_feed.png', level: 32 },
                { name: 'Goat Cheese', arabicName: 'جبن ماعز', url: './images/products/26-50/33_goat_cheese.png', level: 33 },
                
                // Row 6
                { name: 'Pizza', arabicName: 'بيتزا', url: './images/products/26-50/33_pizza.png', level: 33 },
                { name: 'Coal', arabicName: 'فحم', url: './images/products/26-50/33_coal.png', level: 33 },
                { name: 'Refined Coal', arabicName: 'فحم مكرر', url: './images/products/26-50/33_refined_coal.png', level: 33 },
                { name: 'Cherry Popsicle', arabicName: 'مصاصة الكرز', url: './images/products/26-50/33_cherry_popsicle.png', level: 33 },
                
                // Row 7
                { name: 'Feta Pie', arabicName: 'فطيرة جبن فيتا', url: './images/products/26-50/34_feta_pie.png', level: 34 },
                { name: 'Iron Ore', arabicName: 'خام حديد', url: './images/products/26-50/34_iron_ore.png', level: 34 },
                { name: 'Iron Bar', arabicName: 'سبيكة حديد', url: './images/products/26-50/34_iron_bar.png', level: 34 },
                { name: 'Strawberry Ice Cream', arabicName: 'مثلجات الفراولة', url: './images/products/26-50/34_strawberry_ice_cream.png', level: 34 },
                
                // Row 8
                { name: 'Wheat Bundle', arabicName: 'حزمة قمح', url: './images/products/26-50/34_wheat_bundle.png', level: 34 },
                { name: 'Meat Bucket', arabicName: 'دلو لحم', url: './images/products/26-50/34_meat_bucket.png', level: 34 },
                { name: 'Strawberry Cake', arabicName: 'كعكة الفراولة', url: './images/products/26-50/35_strawberry_cake.png', level: 35 },
                { name: 'Baked Potato', arabicName: 'بطاطس مشوية', url: './images/products/26-50/35_baked_potato.png', level: 35 },
                
                // Row 9
                { name: 'Apple Jam', arabicName: 'مربى التفاح', url: './images/products/26-50/35_apple_jam.png', level: 35 },
                { name: 'Chocolate Cake', arabicName: 'كعكة الشوكولاتة', url: './images/products/26-50/36_chocolate_cake.png', level: 36 },
                { name: 'Casserole', arabicName: 'كسرولة', url: './images/products/26-50/36_casserole.png', level: 36 },
                { name: 'Raspberry Jam', arabicName: 'مربى التوت الأحمر', url: './images/products/26-50/36_raspberry_jam.png', level: 36 },
                
                // Row 10
                { name: 'Spicy Pizza', arabicName: 'بيتزا حارة', url: './images/products/26-50/37_spicy_pizza.png', level: 37 },
                { name: 'Blackberry Jam', arabicName: 'مربى التوت الأسود', url: './images/products/26-50/37_blackberry_jam.png', level: 37 },
                { name: 'Potato Feta Cake', arabicName: 'كعكة بطاطس وجبن فيتا', url: './images/products/26-50/38_potato_feta_cake.png', level: 38 },
                { name: 'Cherry Jam', arabicName: 'مربى الكرز', url: './images/products/26-50/38_cherry_jam.png', level: 38 },
                
                // Row 11
                { name: 'Bracelet', arabicName: 'سوار', url: './images/products/26-50/38_bracelet.png', level: 38 },
                { name: 'Potato Bread', arabicName: 'خبز البطاطس', url: './images/products/26-50/39_potato_bread.png', level: 39 },
                { name: 'Shepherd\'s Pie', arabicName: 'فطيرة الراعي', url: './images/products/26-50/39_shepherd_s_pie.png', level: 39 },
                { name: 'Chocolate Ice Cream', arabicName: 'مثلجات الشوكولاتة', url: './images/products/26-50/39_chocolate_ice_cream.png', level: 39 },
                
                // Row 12
                { name: 'Necklace', arabicName: 'قلادة', url: './images/products/26-50/39_necklace.png', level: 39 },
                { name: 'Honey', arabicName: 'عسل', url: './images/products/26-50/39_honey.png', level: 39 },
                { name: 'Honey Popcorn', arabicName: 'فشار بالعسل', url: './images/products/26-50/40_honey_popcorn.png', level: 40 },
                { name: 'Diamond Ring', arabicName: 'خاتم ماس', url: './images/products/26-50/40_diamond_ring.png', level: 40 },
                
                // Row 13
                { name: 'Fish and Chips', arabicName: 'سمك ورقائق', url: './images/products/26-50/41_fish_and_chips.png', level: 41 },
                { name: 'Iron Bracelet', arabicName: 'سوار حديد', url: './images/products/26-50/41_iron_bracelet.png', level: 41 },
                { name: 'Espresso', arabicName: 'قهوة مركزة', url: './images/products/26-50/42_espresso.png', level: 42 },
                { name: 'Honey Apple Cake', arabicName: 'كعكة التفاح والعسل', url: './images/products/26-50/42_honey_apple_cake.png', level: 42 },
                
                // Row 14
                { name: 'Caffè Latte', arabicName: 'قهوة بالحليب', url: './images/products/26-50/43_caff__latte.png', level: 43 },
                { name: 'Chocolate Popcorn', arabicName: 'فشار بالشوكولاتة', url: './images/products/26-50/44_chocolate_popcorn.png', level: 44 },
                { name: 'Lobster Trap', arabicName: 'فخ سرطان البحر', url: './images/products/26-50/44_lobster_trap.png', level: 44 },
                { name: 'Frutti di Mare Pizza', arabicName: 'بيتزا فروتي دي ماري', url: './images/products/26-50/45_frutti_di_mare_pizza.png', level: 45 },
                
                // Row 15
                { name: 'Caffè Mocha', arabicName: 'قهوة موكا', url: './images/products/26-50/45_caff__mocha.png', level: 45 },
                { name: 'Soothing Pad', arabicName: 'وسادة مريحة', url: './images/products/26-50/45_soothing_pad.png', level: 45 },
                { name: 'Raspberry Mocha', arabicName: 'موكا بالتوت', url: './images/products/26-50/46_raspberry_mocha.png', level: 46 },
                { name: 'Lobster Soup', arabicName: 'حساء سرطان البحر', url: './images/products/26-50/46_lobster_soup.png', level: 46 },
                
                // Row 16
                { name: 'Hot Chocolate', arabicName: 'شوكولاتة ساخنة', url: './images/products/26-50/47_hot_chocolate.png', level: 47 },
                { name: 'Tomato Soup', arabicName: 'حساء الطماطم', url: './images/products/26-50/47_tomato_soup.png', level: 47 },
                { name: 'Red Scarf', arabicName: 'وشاح أحمر', url: './images/products/26-50/48_red_scarf.png', level: 48 },
                { name: 'Lobster Skewer', arabicName: 'سيخ سرطان البحر', url: './images/products/26-50/48_lobster_skewer.png', level: 48 },
                
                // Row 17
                { name: 'Beeswax', arabicName: 'شمع العسل', url: './images/products/26-50/48_beeswax.png', level: 48 },
                { name: 'Strawberry Candle', arabicName: 'شمعة فراولة', url: './images/products/26-50/48_strawberry_candle.png', level: 48 },
                { name: 'Pumpkin Soup', arabicName: 'حساء قرع العسل', url: './images/products/26-50/49_pumpkin_soup.png', level: 49 },
                { name: 'Rustic Bouquet', arabicName: 'باقة زهور روستيك', url: './images/products/26-50/49_rustic_bouquet.png', level: 49 },
                
                // Row 18
                { name: 'Asparagus Quiche', arabicName: 'فطيرة الهليون', url: './images/products/26-50/49_asparagus_quiche.png', level: 49 },
                { name: 'Strawberry Jam', arabicName: 'مربى الفراولة', url: './images/products/26-50/50_strawberry_jam.png', level: 50 },
                { name: 'Duck Trap', arabicName: 'فخ البط', url: './images/products/26-50/50_duck_trap.png', level: 50 },
                { name: 'Sesame Ice Cream', arabicName: 'مثلجات السمسم', url: './images/products/26-50/50_sesame_ice_cream.png', level: 50 },
                
                // المستوى 51-75
                // Row 1
                { name: 'Caramel Apple', arabicName: 'تفاح بالكراميل', url: './images/products/51-75/51_caramel_apple.png', level: 51 },
                { name: 'Pillow', arabicName: 'وسادة', url: './images/products/51-75/51_pillow.png', level: 51 },
                { name: 'Asparagus Soup', arabicName: 'حساء الهليون', url: './images/products/51-75/51_asparagus_soup.png', level: 51 },
                { name: 'Toffee', arabicName: 'حلوى الطوفي', url: './images/products/51-75/52_toffee.png', level: 52 },
                
                // Row 2
                { name: 'Raspberry Candle', arabicName: 'شمعة التوت', url: './images/products/51-75/52_raspberry_candle.png', level: 52 },
                { name: 'Pineapple Juice', arabicName: 'عصير أناناس', url: './images/products/51-75/52_pineapple_juice.png', level: 52 },
                { name: 'Fish Soup', arabicName: 'حساء السمك', url: './images/products/51-75/53_fish_soup.png', level: 53 },
                { name: 'Soy Sauce', arabicName: 'صلصة الصويا', url: './images/products/51-75/54_soy_sauce.png', level: 54 },
                
                // Row 3
                { name: 'Chocolate', arabicName: 'شوكولاتة', url: './images/products/51-75/54_chocolate.png', level: 54 },
                { name: 'Fancy Cake', arabicName: 'كيكة فاخرة', url: './images/products/51-75/54_fancy_cake.png', level: 54 },
                { name: 'Sushi Roll', arabicName: 'لفائف سوشي', url: './images/products/51-75/56_sushi_roll.png', level: 56 },
                { name: 'Lollipop', arabicName: 'مصاصة', url: './images/products/51-75/57_lollipop.png', level: 57 },
                
                // Row 4
                { name: 'Feta Salad', arabicName: 'سلاطة الفيتا', url: './images/products/51-75/58_feta_salad.png', level: 58 },
                { name: 'Lobster Sushi', arabicName: 'سوشي سرطان البحر', url: './images/products/51-75/59_lobster_sushi.png', level: 59 },
                { name: 'Blanket', arabicName: 'بطانية', url: './images/products/51-75/59_blanket.png', level: 59 },
                { name: 'Jelly Beans', arabicName: 'حبوب حلوى الجيلي', url: './images/products/51-75/60_jelly_beans.png', level: 60 },
                
                // Row 5
                { name: 'Olive Oil', arabicName: 'زيت زيتون', url: './images/products/51-75/60_olive_oil.png', level: 60 },
                { name: 'Garlic Bread', arabicName: 'خبز بالثوم', url: './images/products/51-75/60_garlic_bread.png', level: 60 },
                { name: 'خبز الكعك', arabicName: 'خبز الكعك', url: './images/products/51-75/61_veggie_bagel.png', level: 61 },
                { name: 'سلطة لحم وخضروات', arabicName: 'سلطة لحم وخضروات', url: './images/products/51-75/62_blt_salad.png', level: 62 },
                
                // Row 6
                { name: 'Mayonnaise', arabicName: 'مايونيز', url: './images/products/51-75/62_mayonnaise.png', level: 62 },
                { name: 'Caramel Latte', arabicName: 'لاتيه بالكراميل', url: './images/products/51-75/62_caramel_latte.png', level: 62 },
                { name: 'Egg Sushi', arabicName: 'سوشي بالبيض', url: './images/products/51-75/63_egg_sushi.png', level: 63 },
                { name: 'Honey Peanuts', arabicName: 'فول سوداني بالعسل', url: './images/products/51-75/63_honey_peanuts.png', level: 63 },
                
                // Row 7
                { name: 'سلطة الاطعمة البحرية', arabicName: 'سلطة الاطعمة البحرية', url: './images/products/51-75/64_seafood_salad.png', level: 64 },
                { name: 'عصير التوت', arabicName: 'عصير التوت', url: './images/products/51-75/64_berry_smoothie.png', level: 64 },
                { name: 'مقرمشات مشكلة', arabicName: 'مقرمشات مشكلة', url: './images/products/51-75/64_snack_mix.png', level: 64 },
                { name: 'خبز محمص بلحم مقدد', arabicName: 'خبز محمص بلحم مقدد', url: './images/products/51-75/65_bacon_toast.png', level: 65 },
                
                // Row 8
                { name: 'Bright Bouquet', arabicName: 'باقة زهور مشرقة', url: './images/products/51-75/65_bright_bouquet.png', level: 65 },
                { name: 'Pineapple Cake', arabicName: 'كيكة الأناناس', url: './images/products/51-75/65_pineapple_cake.png', level: 65 },
                { name: 'Chocolate Pie', arabicName: 'فطيرة الشوكولاتة', url: './images/products/51-75/65_chocolate_pie.png', level: 65 },
                { name: 'حساء الكرنب', arabicName: 'حساء الكرنب', url: './images/products/51-75/65_cabbage_soup.png', level: 65 },
                
                // Row 9
                { name: 'ليمون متخثر', arabicName: 'ليمون متخثر', url: './images/products/51-75/66_lemon_curd.png', level: 66 },
                { name: 'Egg Sandwich', arabicName: 'شطيرة بيض', url: './images/products/51-75/66_egg_sandwich.png', level: 66 },
                { name: 'عصير اخضر', arabicName: 'عصير اخضر', url: './images/products/51-75/66_green_smoothie.png', level: 66 },
                { name: 'زيت الزيتون', arabicName: 'زيت الزيتون', url: './images/products/51-75/66_olive_dip.png', level: 66 },
                
                // Row 10
                { name: 'باستا طازجة', arabicName: 'باستا طازجة', url: './images/products/51-75/67_fresh_pasta.png', level: 67 },
                { name: 'سلطة الباستا', arabicName: 'سلطة الباستا', url: './images/products/51-75/67_pasta_salad.png', level: 67 },
                { name: 'Lemon Pie', arabicName: 'فطيرة الليمون', url: './images/products/51-75/67_lemon_pie.png', level: 67 },
                { name: 'Grilled Asparagus', arabicName: 'هليون مشوي', url: './images/products/51-75/67_grilled_asparagus.png', level: 67 },
                
                // Row 11
                { name: 'Grilled Onion', arabicName: 'بصل مشوي', url: './images/products/51-75/68_grilled_onion.png', level: 68 },
                { name: 'Lemon Cake', arabicName: 'كيكة الليمون', url: './images/products/51-75/68_lemon_cake.png', level: 68 },
                { name: 'Peanut Butter Milkshake', arabicName: 'ميلك شيك بزبدة الفول السوداني', url: './images/products/51-75/68_peanut_butter_milkshake.png', level: 68 },
                { name: 'Tomato Sauce', arabicName: 'صلصة طماطم', url: './images/products/51-75/68_tomato_sauce.png', level: 68 },
                
                // Row 12
                { name: 'Lemon Essential Oil', arabicName: 'زيت الليمون العطري', url: './images/products/51-75/68_lemon_essential_oil.png', level: 68 },
                { name: 'شطيرة كريمة البصل', arabicName: 'شطيرة كريمة البصل', url: './images/products/51-75/69_honey_toast.png', level: 69 },
                { name: 'Fried Rice', arabicName: 'أرز مقلي', url: './images/products/51-75/69_fried_rice.png', level: 69 },
                { name: 'عصير الزبادي', arabicName: 'عصير الزبادي', url: './images/products/51-75/69_yogurt_smoothie.png', level: 69 },
                
                // Row 13
                { name: 'قبعة نسائية', arabicName: 'قبعة نسائية', url: './images/products/51-75/70_cloche_hat.png', level: 70 },
                { name: 'عصير الخيار', arabicName: 'عصير الخيار', url: './images/products/51-75/70_cucumber_smoothie.png', level: 70 },
                { name: 'Orange Juice', arabicName: 'عصير برتقال', url: './images/products/51-75/69_orange_juice.png', level: 69 },
                { name: 'وشاح من الزهور', arabicName: 'وشاح من الزهور', url: './images/products/51-75/69_flower_shawl.png', level: 69 },
                
                // Row 14
                { name: 'Peanut Butter and Jelly Sandwich', arabicName: 'شطيرة زبدة الفول السوداني والمربى', url: './images/products/51-75/71_peanut_butter_and_jelly_sandwich.png', level: 71 },
                { name: 'Onion Soup', arabicName: 'حساء البصل', url: './images/products/51-75/71_onion_soup.png', level: 71 },
                { name: 'Lemon Candle', arabicName: 'شمعة الليمون', url: './images/products/51-75/70_lemon_candle.png', level: 70 },
                { name: 'Top Hat', arabicName: 'قبعة عالية', url: './images/products/51-75/70_top_hat.png', level: 70 },
                
                // Row 15
                { name: 'زلابية ايطالية', arabicName: 'زلابية ايطالية', url: './images/products/51-75/72_gnocchi.png', level: 72 },
                { name: 'Winter Veggies', arabicName: 'خضراوات شتوية', url: './images/products/51-75/72_winter_veggies.png', level: 72 },
                { name: 'حساء المعكرونة', arabicName: 'حساء المعكرونة', url: './images/products/51-75/71_noodle_soup.png', level: 71 },
                { name: 'شعرية الارز', arabicName: 'شعرية الارز', url: './images/products/51-75/71_rice_noodles.png', level: 71 },
                
                // Row 16
                { name: 'باقة جميلة', arabicName: 'باقة جميلة', url: './images/products/51-75/73_gracious_bouquet.png', level: 73 },
                { name: 'Marmalade', arabicName: 'مربى الحمضيات', url: './images/products/51-75/73_marmalade.png', level: 73 },
                { name: 'Sun Hat', arabicName: 'قبعة شمسية', url: './images/products/51-75/72_sun_hat.png', level: 72 },
                { name: 'معكرونة نباتية', arabicName: 'معكرونة نباتية', url: './images/products/51-75/72_veggie_lasagna.png', level: 72 },
                
                // Row 17
                { name: 'Veggie Platter', arabicName: 'طبق خضراوات', url: './images/products/51-75/74_veggie_platter.png', level: 74 },
                { name: 'Chamomile Essential Oil', arabicName: 'زيت البابونج العطري', url: './images/products/51-75/74_chamomile_essential_oil.png', level: 74 },
                { name: 'نقانق', arabicName: 'نقانق', url: './images/products/51-75/73_hot_dog.png', level: 73 },
                { name: 'سلطة الكرنب', arabicName: 'سلطة الكرنب', url: './images/products/51-75/73_coleslaw.png', level: 73 },
                
                // Row 18
                { name: 'حلوى القطن', arabicName: 'حلوى القطن', url: './images/products/51-75/75_cotton_candy.png', level: 75 },
                
                
                // المستوى 76-100
                // Row 1
                { name: 'Peach Tart', arabicName: 'تارت خوخ', url: './images/products/76-100/76_peach_tart.png', level: 76 },
                { name: 'Big Sushi Roll', arabicName: 'لفائف سوشي كبيرة', url: './images/products/76-100/76_big_sushi_roll.png', level: 76 },
                { name: 'Tofu Dog', arabicName: 'هوت دوغ توفو', url: './images/products/76-100/76_tofu_dog.png', level: 76 },
                { name: 'Beetroot Salad', arabicName: 'سلطة شمندر', url: './images/products/76-100/76_beetroot_salad.png', level: 76 },
                
                // Row 2
                { name: 'Plain Donut', arabicName: 'دونات سادة', url: './images/products/76-100/76_plain_donut.png', level: 76 },
                { name: 'Salsa', arabicName: 'صلصة سالسا', url: './images/products/76-100/77_salsa.png', level: 77 },
                { name: 'Taco', arabicName: 'تاكو', url: './images/products/76-100/77_taco.png', level: 77 },
                { name: 'Colourful Omelet', arabicName: 'أومليت ملون', url: './images/products/76-100/77_colourful_omelet.png', level: 77 },
                
                // Row 3
                { name: 'Spring Omelet', arabicName: 'أومليت الربيع', url: './images/products/76-100/77_spring_omelet.png', level: 77 },
                { name: 'Orange Sorbet', arabicName: 'مثلجات البرتقال', url: './images/products/76-100/78_orange_sorbet.png', level: 78 },
                { name: 'Corn Dog', arabicName: 'هوت دوغ بالذرة', url: './images/products/76-100/78_corn_dog.png', level: 78 },
                { name: 'Potato Soup', arabicName: 'حساء البطاطس', url: './images/products/76-100/78_potato_soup.png', level: 78 },
                
                // Row 4
                { name: 'Summer Rolls', arabicName: 'لفائف الصيف', url: './images/products/76-100/78_summer_rolls.png', level: 78 },
                { name: 'Sesame Brittle', arabicName: 'حلوى السمسم', url: './images/products/76-100/78_sesame_brittle.png', level: 78 },
                { name: 'Affogato', arabicName: 'أفوغاتو', url: './images/products/76-100/78_affogato.png', level: 78 },
                { name: 'Fish Taco', arabicName: 'تاكو السمك', url: './images/products/76-100/79_fish_taco.png', level: 79 },
                
                // Row 5
                { name: 'Peach Jam', arabicName: 'مربى الخوخ', url: './images/products/76-100/79_peach_jam.png', level: 79 },
                { name: 'Lobster Pasta', arabicName: 'معكرونة بسرطان البحر', url: './images/products/76-100/79_lobster_pasta.png', level: 79 },
                { name: 'Cucumber Sandwich', arabicName: 'شطيرة خيار', url: './images/products/76-100/79_cucumber_sandwich.png', level: 79 },
                { name: 'Spicy Fish', arabicName: 'سمك حار', url: './images/products/76-100/79_spicy_fish.png', level: 79 },
                
                // Row 6
                { name: 'Sprinkled Donut', arabicName: 'دونات بالرش', url: './images/products/76-100/79_sprinkled_donut.png', level: 79 },
                { name: 'Cheese Omelet', arabicName: 'أومليت بالجبن', url: './images/products/76-100/79_cheese_omelet.png', level: 79 },
                { name: 'Green Tea', arabicName: 'شاي أخضر', url: './images/products/76-100/80_green_tea.png', level: 80 },
                { name: 'Onion Dog', arabicName: 'هوت دوغ بالبصل', url: './images/products/76-100/80_onion_dog.png', level: 80 },
                
                // Row 7
                { name: 'Stuffed Peppers', arabicName: 'فلفل محشي', url: './images/products/76-100/80_stuffed_peppers.png', level: 80 },
                
                
                // المستوى 101-125
                // Row 1
                { name: 'Fresh Diffuser', arabicName: 'معطر منعش', url: './images/products/101-125/110_fresh_diffuser.png', level: 110 },
                { name: 'Rice Ball', arabicName: 'كرات الأرز', url: './images/products/101-125/110_rice_ball.png', level: 110 },
                { name: 'Guava Cupcake', arabicName: 'كب كيك الجوافة', url: './images/products/101-125/109_guava_cupcake.png', level: 109 },
                { name: 'Peanut Fudge', arabicName: 'حلوى الفول السوداني', url: './images/products/101-125/111_peanut_fudge.png', level: 111 },
                
                // Row 2
                { name: 'Winter Stew', arabicName: 'يخني الشتاء', url: './images/products/101-125/112_winter_stew.png', level: 112 },
                { name: 'Tropical Cupcake', arabicName: 'كب كيك استوائي', url: './images/products/101-125/112_tropical_cupcake.png', level: 112 },
                { name: 'Plain Waffles', arabicName: 'وافل سادة', url: './images/products/101-125/114_plain_waffles.png', level: 114 },
                { name: 'Zesty Perfume', arabicName: 'عطر منعش', url: './images/products/101-125/111_zesty_perfume.png', level: 111 },
                { name: 'Cookie Cupcake', arabicName: 'كب كيك بالكوكيز', url: './images/products/101-125/111_cookie_cupcake.png', level: 111 },
                { name: 'Calming Diffuser', arabicName: 'معطر مهدئ', url: './images/products/101-125/116_calming_diffuser.png', level: 116 },
                { name: 'Orange Salad', arabicName: 'سلطة البرتقال', url: './images/products/101-125/117_orange_salad.png', level: 117 },
                
                // Row 3
                { name: 'Chocolate Waffles', arabicName: 'وافل بالشوكولاتة', url: './images/products/101-125/117_chocolate_waffles.png', level: 117 },
                { name: 'Breakfast Waffles', arabicName: 'وافل الإفطار', url: './images/products/101-125/119_breakfast_waffles.png', level: 119 },
                { name: 'Breakfast Bowl', arabicName: 'وجبة إفطار في وعاء', url: './images/products/101-125/119_breakfast_bowl.png', level: 119 },
                { name: 'Apple Porridge', arabicName: 'عصيدة التفاح', url: './images/products/101-125/119_apple_porridge.png', level: 119 },
                
                // Row 4
                { name: 'Pineapple Coconut Bars', arabicName: 'ألواح الأناناس وجوز الهند', url: './images/products/101-125/120_pineapple_coconut_bars.png', level: 120 },
                { name: 'Sweet Porridge', arabicName: 'عصيدة حلوة', url: './images/products/101-125/120_sweet_porridge.png', level: 120 },
                { name: 'Rich Soap', arabicName: 'صابون فاخر', url: './images/products/101-125/121_rich_soap.png', level: 121 },
                { name: 'Fresh Porridge', arabicName: 'عصيدة طازجة', url: './images/products/101-125/122_fresh_porridge.png', level: 122 },
                
                // Row 5
                { name: 'Vanilla Milkshake', arabicName: 'ميلك شيك فانيليا', url: './images/products/101-125/124_vanilla_milkshake.png', level: 124 },
                { name: 'Mocha Milkshake', arabicName: 'ميلك شيك موكا', url: './images/products/101-125/125_mocha_milkshake.png', level: 125 },
                
                
                // المستوى 126-150
                // Row 1
                { name: 'Fruity Milkshake', arabicName: 'ميلك شيك بالفواكه', url: './images/products/126-150/126_fruity_milkshake.png', level: 126 },
                
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
        const originalUrl = productData.url;
        
        // التحقق مما إذا كانت الصورة محلية أو خارجية
        const isLocalImage = originalUrl.startsWith('./') || originalUrl.startsWith('../') || originalUrl.startsWith('/');
        
        if (isLocalImage) {
            // للصور المحلية، استخدم المسار كما هو
            img.src = originalUrl;
            img.alt = productData.name;
            img.loading = 'lazy'; // تحميل الصور بشكل تدريجي
            img.onerror = function() {
                // إذا فشل تحميل الصورة المحلية، استخدم صورة بديلة
                this.src = 'https://via.placeholder.com/100x100?text=' + encodeURIComponent(productData.name);
                console.error('فشل تحميل الصورة المحلية:', originalUrl);
            };
        } else {
            // للصور الخارجية، استخدم نفس المنطق السابق
            // إزالة معلمات الاستعلام
            const cleanUrl = originalUrl.split('?')[0];
            // استخدام بروكسي CORS للصور
            const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
            // تجربة الرابط المباشر أولاً
            img.src = cleanUrl;
            img.alt = productData.name;
            img.loading = 'lazy'; // تحميل الصور بشكل تدريجي
            img.crossOrigin = 'anonymous'; // السماح بالتحميل عبر CORS
            img.onerror = function() {
                // في حالة فشل تحميل الصورة، جرب استخدام بروكسي CORS
                this.onerror = function() {
                    // إذا فشل البروكسي أيضًا، استخدم صورة بديلة
                    this.src = 'https://via.placeholder.com/100x100?text=' + encodeURIComponent(productData.name);
                };
                // جرب استخدام البروكسي
                this.src = corsProxyUrl + cleanUrl;
            };
        }
        
        // إنشاء حاوية الأسماء
        const namesContainer = document.createElement('div');
        namesContainer.className = 'product-names';
        
        // إنشاء اسم المنتج بالعربي (إذا كان موجوداً)
        if (productData.arabicName) {
            const arabicNameDiv = document.createElement('div');
            arabicNameDiv.className = 'product-name arabic-name';
            arabicNameDiv.textContent = productData.arabicName;
            namesContainer.appendChild(arabicNameDiv);
        }
        
        // إنشاء اسم المنتج بالإنجليزي
        const nameDiv = document.createElement('div');
        nameDiv.className = 'product-name english-name';
        nameDiv.textContent = productData.name;
        
        // استخدام مستوى المنتج من بيانات المنتج مباشرة
        let level = productData.level || '?';
        
        // إنشاء مستوى المنتج
        const levelDiv = document.createElement('div');
        levelDiv.className = 'product-level';
        levelDiv.textContent = 'Level ' + level;
        
        // لم نعد نحتاج إلى زر التحميل بناءً على طلب المستخدم
        
        // لم نعد نحتاج إلى منطقة التفاصيل الموسعة بناءً على طلب المستخدم
        
        // إضافة اسم المنتج الإنجليزي إلى حاوية الأسماء
        namesContainer.appendChild(nameDiv);
        
        // إضافة العناصر إلى البطاقة
        card.appendChild(img);
        card.appendChild(namesContainer);
        card.appendChild(levelDiv);
        
        // إضافة خاصية التبديل (إظهار/إخفاء) للمنتجات من المستوى 1-25
        if (productData.level >= 1 && productData.level <= 25) {
            card.addEventListener('click', function(e) {
                
                // تبديل حالة العرض باستخدام فئة CSS فقط
                cardContainer.classList.toggle('product-hidden');
            });
        }
        
        // إضافة البطاقة إلى الحاوية
        cardContainer.appendChild(card);
        
        return cardContainer;
    }
    
    // دالة تحميل صورة من مصدر الصورة المحملة بالفعل
    function downloadImageFromSrc(imgSrc, fileName) {
        // إظهار رسالة التحميل
        statusMessage.textContent = `جاري تحميل ${fileName}...`;
        statusMessage.style.color = '#3498db';
        
        // إنشاء عنصر canvas لتحويل الصورة
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            // ضبط حجم canvas ليناسب الصورة
            canvas.width = img.width;
            canvas.height = img.height;
            
            // رسم الصورة على canvas
            ctx.drawImage(img, 0, 0);
            
            // تحويل canvas إلى URL للتحميل
            try {
                const dataURL = canvas.toDataURL('image/png');
                
                // إنشاء رابط للتحميل
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = `${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                document.body.appendChild(link);
                link.click();
                
                // تنظيف الموارد
                setTimeout(() => {
                    document.body.removeChild(link);
                    statusMessage.textContent = `تم تحميل ${fileName} بنجاح!`;
                    statusMessage.style.color = '#2ecc71';
                    setTimeout(() => {
                        statusMessage.style.color = '';
                    }, 2000);
                }, 100);
            } catch (error) {
                console.error('Error converting image to data URL:', error);
                // في حالة الفشل، جرب طريقة التحميل القديمة
                const imgUrl = imgSrc.split('?')[0]; // إزالة معلمات الاستعلام
                downloadImage(imgUrl, fileName);
            }
        };
        
        img.onerror = function() {
            console.error('Error loading image for download');
            statusMessage.textContent = `فشل تحميل الصورة`;
            statusMessage.style.color = '#e74c3c';
            setTimeout(() => {
                statusMessage.style.color = '';
            }, 3000);
        };
        
        // تحميل الصورة
        img.src = imgSrc;
    }
    
    // دالة تحميل صورة واحدة (طريقة احتياطية)
    function downloadImage(url, fileName) {
        // إظهار رسالة التحميل
        statusMessage.textContent = `جاري تحميل ${fileName}...`;
        statusMessage.style.color = '#3498db';
        
        // التحقق مما إذا كانت الصورة محلية أو خارجية
        const isLocalImage = url.startsWith('./') || url.startsWith('../') || url.startsWith('/');
        
        if (isLocalImage) {
            // للصور المحلية، نستخدم طريقة مختلفة للتحميل
            // نقوم بتحميل الصورة أولاً باستخدام fetch
            fetch(url)
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
                    // استخراج اسم الملف من المسار
                    const pathParts = url.split('/');
                    const fileNameFromPath = pathParts[pathParts.length - 1];
                    link.download = fileNameFromPath;
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
                    console.error('Local image download failed:', error);
                    statusMessage.textContent = `فشل تحميل الصورة: ${error.message}`;
                    statusMessage.style.color = '#e74c3c';
                    setTimeout(() => {
                        statusMessage.style.color = '';
                    }, 3000);
                });
        } else {
            // للصور الخارجية، نستخدم نفس المنطق السابق
            // تحويل الرابط للتأكد من أنه لا يحتوي على معلمات منع التحميل
            const cleanUrl = url.split('?')[0];
            // بروكسي CORS للتحميل عبر الإنترنت
            const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
            
            // محاولة تحميل الصورة مباشرة أولاً
            tryDownload(cleanUrl)
                .catch(error => {
                    console.log('Direct download failed, trying with CORS proxy:', error);
                    // إذا فشلت المحاولة الأولى، جرب باستخدام بروكسي CORS
                    return tryDownload(corsProxyUrl + cleanUrl);
                })
                .catch(error => {
                    console.error('All download attempts failed:', error);
                    statusMessage.textContent = `فشل تحميل الصورة: ${error.message}`;
                    statusMessage.style.color = '#e74c3c';
                    setTimeout(() => {
                        statusMessage.style.color = '';
                    }, 3000);
                });
        }
            
        // دالة داخلية لمحاولة التحميل (للصور الخارجية)
        function tryDownload(downloadUrl) {
            return fetch(downloadUrl, { mode: 'cors', credentials: 'omit' })
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
                });
        }
    }
    

    
    // إظهار رسالة ترحيبية
    statusMessage.textContent = 'انقر على زر "جلب صور المنتجات" للبدء.';
    
    // دالة تحميل جميع الصور دفعة واحدة
    async function downloadAllImages() {
        // التحقق من وجود صور للتحميل
        if (!productsLoaded || productImages.length === 0) {
            statusMessage.textContent = 'يجب جلب صور المنتجات أولاً قبل التحميل';
            statusMessage.style.color = '#e74c3c';
            setTimeout(() => {
                statusMessage.style.color = '';
            }, 3000);
            return;
        }
        
        // تعطيل زر التحميل وإظهار شريط التقدم
        downloadAllBtn.disabled = true;
        downloadProgress.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        statusMessage.textContent = 'جارٍ تحميل جميع الصور...';
        statusMessage.style.color = '#3498db';
        
        // التحقق من وجود مكتبة JSZip
        if (typeof JSZip === 'undefined') {
            // تحميل مكتبة JSZip ديناميكياً
            statusMessage.textContent = 'جارٍ تحميل مكتبة الضغط...';
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = function() {
                // بعد تحميل المكتبة، ابدأ عملية التحميل
                statusMessage.textContent = 'تم تحميل مكتبة الضغط بنجاح، جارٍ تحميل الصور...';
                setTimeout(() => processDownload(), 500); // انتظر قليلاً للتأكد من تحميل المكتبة
            };
            script.onerror = function() {
                statusMessage.textContent = 'فشل تحميل مكتبة الضغط. حاول مرة أخرى لاحقاً.';
                statusMessage.style.color = '#e74c3c';
                downloadAllBtn.disabled = false;
                downloadProgress.classList.add('hidden');
            };
            document.head.appendChild(script);
        } else {
            // المكتبة موجودة بالفعل، ابدأ عملية التحميل
            processDownload();
        }
        
        async function processDownload() {
            try {
                // التأكد من أن JSZip متاح قبل استخدامه
                if (typeof JSZip === 'undefined') {
                    throw new Error('مكتبة JSZip غير متوفرة. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
                }
                
                const zip = new JSZip();
                const totalImages = productImages.length;
                let completedImages = 0;
                
                // إنشاء مجلدات للمستويات المختلفة
                const levelFolders = {};
                
                // تقسيم المنتجات حسب نطاق المستوى
                const levelRanges = [
                    { min: 1, max: 25 },
                    { min: 26, max: 50 },
                    { min: 51, max: 75 },
                    { min: 76, max: 100 },
                    { min: 101, max: 125 },
                    { min: 126, max: 150 }
                ];
                
                // إنشاء المجلدات في ملف ZIP
                levelRanges.forEach(range => {
                    const folderName = `مستوى_${range.min}-${range.max}`;
                    levelFolders[`${range.min}-${range.max}`] = zip.folder(folderName);
                });
                
                // تحميل كل صورة وإضافتها إلى المجلد المناسب
                const downloadPromises = productImages.map(async (product, index) => {
                    try {
                        // تحديد المجلد المناسب للمنتج بناءً على المستوى
                        let targetFolder = null;
                        for (const range of levelRanges) {
                            if (product.level >= range.min && product.level <= range.max) {
                                targetFolder = levelFolders[`${range.min}-${range.max}`];
                                break;
                            }
                        }
                        
                        // إذا لم يتم العثور على مجلد مناسب، استخدم المجلد الرئيسي
                        if (!targetFolder) {
                            targetFolder = zip;
                        }
                        
                        // تنظيف الرابط من معلمات الاستعلام
                        const cleanUrl = product.url.split('?')[0];
                        
                        // تحميل الصورة
                        const response = await fetch(cleanUrl, { mode: 'cors', credentials: 'omit' });
                        if (!response.ok) {
                            throw new Error(`فشل تحميل ${product.name}: ${response.statusText}`);
                        }
                        
                        const blob = await response.blob();
                        
                        // إضافة الصورة إلى المجلد المناسب
                        const fileName = `${product.level}_${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                        targetFolder.file(fileName, blob);
                        
                        // تحديث التقدم
                        completedImages++;
                        const progress = Math.round((completedImages / totalImages) * 100);
                        progressBar.style.width = `${progress}%`;
                        progressText.textContent = `${progress}%`;
                        
                        // تحديث رسالة الحالة كل 10 صور
                        if (completedImages % 10 === 0 || completedImages === totalImages) {
                            statusMessage.textContent = `جارٍ تحميل الصور: ${completedImages} من ${totalImages}`;
                        }
                    } catch (error) {
                        console.error(`فشل تحميل ${product.name}:`, error);
                        // استمر بالتحميل حتى مع وجود أخطاء
                        completedImages++;
                        const progress = Math.round((completedImages / totalImages) * 100);
                        progressBar.style.width = `${progress}%`;
                        progressText.textContent = `${progress}%`;
                    }
                });
                
                // انتظار اكتمال جميع عمليات التحميل
                await Promise.all(downloadPromises);
                
                // إنشاء ملف ZIP وتحميله
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const zipUrl = URL.createObjectURL(zipBlob);
                
                // إنشاء رابط للتحميل
                const downloadLink = document.createElement('a');
                downloadLink.href = zipUrl;
                downloadLink.download = `Hay_Day_Products_${new Date().toISOString().slice(0, 10)}.zip`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                
                // تنظيف الموارد
                setTimeout(() => {
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(zipUrl);
                    
                    // تحديث رسالة الحالة
                    statusMessage.textContent = `تم تحميل ${completedImages} صورة بنجاح!`;
                    statusMessage.style.color = '#2ecc71';
                    
                    // إعادة تفعيل الزر وإخفاء شريط التقدم بعد فترة
                    setTimeout(() => {
                        downloadAllBtn.disabled = false;
                        downloadProgress.classList.add('hidden');
                        statusMessage.style.color = '';
                    }, 3000);
                }, 100);
                
            } catch (error) {
                console.error('حدث خطأ أثناء تحميل الصور:', error);
                statusMessage.textContent = `حدث خطأ أثناء تحميل الصور: ${error.message}`;
                statusMessage.style.color = '#e74c3c';
                downloadAllBtn.disabled = false;
                downloadProgress.classList.add('hidden');
            }
        }
    }
    
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
    
    // متغير لتتبع القسم النشط حالياً
    let activeSection = null;
    
    // إضافة مستمعي الأحداث لأزرار المستويات
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            // الحصول على نطاق المستوى من سمات البيانات
            const minLevel = parseInt(button.dataset.minLevel);
            const maxLevel = parseInt(button.dataset.maxLevel);
            const sectionId = `level-${minLevel}-${maxLevel}`;
            
            // التحقق مما إذا كان هذا هو القسم النشط بالفعل
            if (activeSection === sectionId && button.classList.contains('active')) {
                // إلغاء تنشيط القسم الحالي
                button.classList.remove('active');
                activeSection = null;
                
                // إخفاء جميع المنتجات
                sectionContents.forEach(container => {
                    container.innerHTML = '';
                    container.classList.remove('active');
                });
                
                // تحديث رسالة الحالة
                statusMessage.textContent = 'انقر على أحد أزرار المستويات لعرض المنتجات.';
            } else {
                // إزالة الفئة النشطة من جميع الأزرار
                levelButtons.forEach(btn => btn.classList.remove('active'));
                
                // إضافة الفئة النشطة للزر المحدد
                button.classList.add('active');
                
                // تحديث القسم النشط
                activeSection = sectionId;
                
                // تصفية وعرض المنتجات حسب نطاق المستوى
                filterProductsByLevel(minLevel, maxLevel);
            }
        });
    });
    
    // دالة عرض المنتج النادر محلياً في منتصف الموقع
    async function downloadRareProduct() {
        try {
            // تعطيل الزر وإظهار رسالة التحميل
            rareProductBtn.disabled = true;
            statusMessage.textContent = 'جاري تحميل المنتج النادر...';
            statusMessage.style.color = '#ffc107';
            
            // مسار الصورة في مجلد Yasser
            const rareProductImageUrl = './images/products/Yasser/Yasser.png';
            
            // إنشاء أو إزالة modal للصورة
            let modal = document.getElementById('rare-product-modal');
            
            // إذا كان modal موجود، أزله وأوقف الصوت
            if (modal) {
                modal.remove();
                stopRareProductAudio();
                statusMessage.textContent = 'تم إغلاق المنتج النادر.';
                statusMessage.style.color = '#6c757d';
                rareProductBtn.disabled = false;
                setTimeout(() => {
                    statusMessage.style.color = '';
                }, 2000);
                return;
            }
            
            // إنشاء modal جديد
            modal = document.createElement('div');
            modal.id = 'rare-product-modal';
            modal.className = 'rare-product-modal';
            
            // إنشاء محتوى modal مع تأثيرات احتفالية
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="simple-close-btn" onclick="window.stopRareProductAudio(); this.closest('.rare-product-modal').remove(); document.getElementById('rare-product-btn').disabled = false;">×</button>
                    <div class="fireworks">
                        <div class="firework" style="left: 10%; animation-delay: 0s;"></div>
                        <div class="firework" style="left: 30%; animation-delay: 0.5s;"></div>
                        <div class="firework" style="left: 50%; animation-delay: 1s;"></div>
                        <div class="firework" style="left: 70%; animation-delay: 1.5s;"></div>
                        <div class="firework" style="left: 90%; animation-delay: 2s;"></div>
                    </div>
                    <img src="${rareProductImageUrl}" alt="المنتج النادر" onerror="this.src='https://via.placeholder.com/400x400?text=الصورة+غير+موجودة'" onclick="window.playRareProductAudioManual()" style="cursor: pointer;">
                </div>
            `;
            
            // إضافة modal إلى الصفحة
            document.body.appendChild(modal);
            
            // تشغيل الصوت
            playRareProductAudio();
            
            // رسالة نجاح
            statusMessage.textContent = 'تم عرض المنتج النادر!';
            statusMessage.style.color = '#28a745';
            
            // إعادة تفعيل الزر
            rareProductBtn.disabled = false;
            
            setTimeout(() => {
                statusMessage.style.color = '';
            }, 3000);
            
        } catch (error) {
            console.error('خطأ في عرض المنتج النادر:', error);
            
            // رسالة خطأ
            statusMessage.textContent = 'فشل عرض المنتج النادر. تأكد من وجود الصورة في مجلد Yasser.';
            statusMessage.style.color = '#dc3545';
            
            // إعادة تفعيل الزر
            rareProductBtn.disabled = false;
            
            setTimeout(() => {
                statusMessage.style.color = '';
            }, 5000);
        }
    }
    
    // دالة تشغيل الصوت
    function playRareProductAudio() {
        try {
            // إنشاء عنصر الصوت
            const audio = new Audio('./images/products/Yasser/alo.mp3');
            audio.volume = 0.7; // مستوى الصوت 70%
            audio.loop = true; // تكرار الصوت
            
            // تخزين الصوت في متغير عام للتحكم به
            window.rareProductAudio = audio;
            
            // إضافة مستمع أحداث لوقف الصوت عند أي ضغطة (بعد تأخير)
            const stopAudioOnClick = function(event) {
                // تجاهل الضغطة على الصورة نفسها
                if (event.target.tagName === 'IMG' && event.target.alt === 'المنتج النادر') {
                    return;
                }
                
                // تجاهل الضغطة على زر الإغلاق
                if (event.target.classList.contains('simple-close-btn')) {
                    return;
                }
                
                if (window.rareProductAudio) {
                    stopRareProductAudio();
                    document.removeEventListener('click', stopAudioOnClick);
                }
            };
            
            // إضافة المستمع للصفحة بأكملها بعد تأخير
            setTimeout(() => {
                document.addEventListener('click', stopAudioOnClick);
                window.stopAudioOnClick = stopAudioOnClick;
            }, 1000); // تأخير ثانية واحدة
            
            // تشغيل الصوت
            audio.play().catch(error => {
                console.log('لا يمكن تشغيل الصوت تلقائياً:', error);
                // إظهار رسالة للمستخدم
                statusMessage.textContent = 'اضغط على الصورة لتشغيل الصوت';
                statusMessage.style.color = '#ffc107';
                setTimeout(() => {
                    statusMessage.style.color = '';
                }, 3000);
            });
            
        } catch (error) {
            console.error('خطأ في تشغيل الصوت:', error);
        }
    }
    
    // دالة إيقاف الصوت
    function stopRareProductAudio() {
        try {
            if (window.rareProductAudio) {
                window.rareProductAudio.pause();
                window.rareProductAudio.currentTime = 0;
                window.rareProductAudio = null;
            }
            
            // إزالة مستمع الأحداث
            if (window.stopAudioOnClick) {
                document.removeEventListener('click', window.stopAudioOnClick);
                window.stopAudioOnClick = null;
            }
        } catch (error) {
            console.error('خطأ في إيقاف الصوت:', error);
        }
    }
    
    // دالة تشغيل الصوت يدوياً (عند الضغط على الصورة)
    function playRareProductAudioManual() {
        try {
            if (!window.rareProductAudio) {
                // إنشاء عنصر الصوت
                const audio = new Audio('./images/products/Yasser/alo.mp3');
                audio.volume = 0.7; // مستوى الصوت 70%
                audio.loop = true; // تكرار الصوت
                
                // تخزين الصوت في متغير عام للتحكم به
                window.rareProductAudio = audio;
                
                // إضافة مستمع أحداث لوقف الصوت عند أي ضغطة (بعد تأخير)
                const stopAudioOnClick = function(event) {
                    // تجاهل الضغطة على الصورة نفسها
                    if (event.target.tagName === 'IMG' && event.target.alt === 'المنتج النادر') {
                        return;
                    }
                    
                    // تجاهل الضغطة على زر الإغلاق
                    if (event.target.classList.contains('simple-close-btn')) {
                        return;
                    }
                    
                    if (window.rareProductAudio) {
                        stopRareProductAudio();
                        document.removeEventListener('click', stopAudioOnClick);
                    }
                };
                
                // إضافة المستمع للصفحة بأكملها بعد تأخير
                setTimeout(() => {
                    document.addEventListener('click', stopAudioOnClick);
                    window.stopAudioOnClick = stopAudioOnClick;
                }, 1000); // تأخير ثانية واحدة
            }
            
            // تشغيل الصوت
            window.rareProductAudio.play().catch(error => {
                console.log('لا يمكن تشغيل الصوت:', error);
            });
            
        } catch (error) {
            console.error('خطأ في تشغيل الصوت يدوياً:', error);
        }
    }
    
    // تعريف الدوال في النطاق العام
    window.stopRareProductAudio = stopRareProductAudio;
    window.playRareProductAudioManual = playRareProductAudioManual;
});
