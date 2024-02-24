const categoryCollection = require("../Model/categoryModel");
const productCollection = require("../Model/productModel");



//    admin product process fn below




const productlist= async (req, res) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = 4;
        let skip = (page - 1) * limit;
    
        let   count = await productCollection.find().estimatedDocumentCount();
    
        let productData = await productCollection.find().skip(skip).limit(limit);
        let categoryList = await categoryCollection.find(
          {},
          { categoryName: true }
        );
        res.render("admin/productlist.ejs", {
          productData,
          categoryList,count,
          limit,
          productExist: req.session.productAlreadyExists,
        });
        req.session.productAlreadyExists = null;
      } catch (error) {
        console.error(error);
      }
  };
  const addProductPage = async (req, res) => {
    try {
      const categories = await categoryCollection.find({ isListed:true});
  
      console.log(categories);
      res.render("admin/addproduct.ejs", {
        categories,
      });
      req.session.productAlreadyExists = null;
    } catch (error) {
      console.error(error);
    }
  };
  const addProduct = async (req, res) => {
    console.log(productCollection);
    try {
      let existingProduct = await productCollection.findOne({
        productName: { $regex: new RegExp(req.body.productName, "i") },
         productName: req.body.productName,
      });
      if (!existingProduct) {
        console.log("in");
        await productCollection.insertMany([
          {
            productName: req.body.productName,
            parentCategory: req.body.parentCategory,
            productImage1: req.files[0].filename,
            productImage2: req.files[1].filename,
            productImage3: req.files[2].filename,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
          },
        ]);
        // console.log(req.files[0].filename);
        res.redirect("/admin/products");
      } else {
        console.log("addpro out")
        req.session.productAlreadyExists = existingProduct;
        res.redirect("/admin/addproduct");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const editProductpage = async (req, res) => {
    try {
      console.log("editpage");
      const productId = req.params.id;
      console.log(productId);
      const productData = await productCollection.findOne({_id:productId}); 
      const categories = await categoryCollection.find({ })
      console.log(categories);
      res.render("admin/editproduct.ejs", {
        productData,categories
        // productExists: req.session.productAlreadyExists,
      });
    } catch (error) {
      console.error( error);
    }
  };

const deleteProduct = async (req,res)=>{
   try{
      await productCollection.findOneAndDelete({ _id: req.params.id });
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
    }
  }



  const unListProduct = async (req, res) => {
    try {
      await productCollection.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isListed: false } }
      );
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
    }
  };


  
  const listProduct = async (req, res) => {
    try {
      await productCollection.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isListed: true } }
      );
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
    }
  };




  const sortPricefn = async(req,res)=>{
    try{
        if(req.params.id == "lowToHigh"){
            let data = req.session.categoriesFilter
            let i=0
            let temp;
            let j;
             while(i<data.length)
            {
                j=i+1
                while(j<data.length){
                    if(data[i].productPrice>data[j].productPrice)
                    {
                        temp= data[i]
                        data[i]=data[j]
                        data[j]=temp
                    }
                    j++
                }
                i++
            }
            req.session.count = (req.session.categoriesFilter).length
            req.session.save()
            res.redirect("/productCategory")
        }else if(req.params.id == "highToLow"){
            let data = req.session.categoriesFilter
            console.log(req.session.categoriesFilter)
            let i=0
            let temp;
            let j;
             while(i<data.length)
            {
                j=i+1
                while(j<data.length){
                    if(data[i].productPrice<data[j].productPrice)
                    {
                        temp= data[i]
                        data[i]=data[j]
                        data[j]=temp
                    }
                    j++
                }
                i++
            }
            req.session.categoriesFilter = data
            req.session.count = data.length
            req.session.save()
            res.redirect("/productCategory")
        }
    }catch(err){
        res.status(500).send({success:false})
        console.log(`Error from sortPrice ${err}`)
    }
}


  const editProduct = async (req, res) => {
    console.log("edit");
    try {
      let existingProduct = await productCollection.findOne({
        productName: { $regex: new RegExp(req.body.productName, "i") },
      });
      if (!existingProduct || existingProduct._id == req.params.id) {
        console.log("edit1");

        const updateFields = {
          $set: {
            productName: req.body.productName,
            parentCategory: req.body.parentCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
          },
        };
  
        if (req.files[0]) {
          updateFields.$set.productImage1 = req.files[0].filename;
        }
  
        if (req.files[1]) {
          updateFields.$set.productImage2 = req.files[1].filename;
        }
  
        if (req.files[2]) {
          updateFields.$set.productImage3 = req.files[2].filename;
        }
        await productCollection.findOneAndUpdate(
          { _id: req.params.id },
          updateFields
        );
        console.log("edit3");
  
        res.redirect("/admin/products");
      } else {
        req.session.productAlreadyExists = existingProduct;
        res.redirect("/admin/products");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  module.exports = 
  {
    addProduct,
    addProductPage,
    productlist,
    editProductpage,
    editProduct,
    unListProduct,
    listProduct,
    deleteProduct,
    sortPricefn,
    productCategoryfn,
    ProductDetailsfn
  }





  // //    user product process fn below


  const productCategoryfn = async (req, res) => {
    req.session.userInfo
    req.session.userInfo1
    try {
      let page = Number(req.query.page) || 1;
      let limit = 8;
      let skip = (page - 1) * limit;
  
      let categoryData = await categoryCollection.find({ isListed: true });
      let productData = await productCollection
        .find({ isListed: true })
        .skip(skip)
        .limit(limit)
        productData = await  req.session.categoriesFilter ? req.session.categoriesFilter : productData;
  
        req.session.categoriesFilter = productData
        req.session.save()
  
      let count = await productCollection.countDocuments({ isListed: true });
      let totalPages = Math.ceil(count / limit);
      let totalPagesArray = new Array(totalPages).fill(null);
      let userInfo2 =  req.session.userInfo2;
      res.render("user/productsCategory", {
        categoryData,
        productData,
        currentUser: req.session.userInfo2,
        user: req.session.user,
        count,
        limit,
        totalPagesArray,
        currentPage: page,
        selectedFilter: req.session.selectedFilter,
      });
    } catch (error) {   
      console.error("Error fetching product data:", error);
      res.status(500).send("Internal Server Error");
    }
  };


  const ProductDetailsfn = async (req, res) => {
    try {
      const currentProduct = await productCollection.findOne({
        _id: req.params.id,
      });
      res.render("user/productDetails", {
        user: req.session.user,
        currentProduct,
      });
      console.log(currentProduct);
    } catch (error) { }
  };