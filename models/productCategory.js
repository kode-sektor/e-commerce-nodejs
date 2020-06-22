

const productCategory = {

    productCategorySamples : [

		{
		    title : "Anchor Gold Chain",
		    description : "24 carat-golden sparkling chain",
		    price : "1700",
		    featured: false,
		    imgPath : "jewelry-1.jpg",
		    category : "jewelry"
		},
		{
		    title : "AccuWeight Digital Kitchen",
		    description : "Multifunction Meat Food Scale Tempered Glass surface with LCD Display",
		    price : "300",
		    featured: false,
		    imgPath : "kitchen-scale.jpg",
		    category : "kitchen"
		},
		{
		    title : "Reebok Work Men's",
		    description : "Reebok Work Men's Sublite Cushion IB4041 Industrial Shoe",
		    price : "220",
		    featured: true,
		    imgPath : "shoe-reebok.jpg",
		    category : "shoe"
		},
		{
		    title : "GUANK Men’s Wooden Watch",
		    description : "GUANK Men’s Wooden Watches Personalized Engraved",
		    price : "125",
		    featured: false,
		    imgPath : "watchh-guanke-wooden.jpg",
		    category : "watch"
		}

		],

		getCategProducts() {
		    return this.productCategorySamples;
		},


	}

	module.exports = productCategory;