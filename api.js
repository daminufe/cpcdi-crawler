const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const mongoose = require('mongoose');
const categoryMap = {
  'Acess Point': 'Informática, Portáteis e Tablets',
  'Adaptadores_e_Cabos': 'Informática, Portáteis e Tablets',
  'Caixas': 'Informática, Portáteis e Tablets',
  'Camaras_Fotograficas_Acessorios': 'Foto & Vídeo',
  'Camaras_Fotograficas_Digitais': 'Foto & Vídeo',
  'Camaras_Vídeo': 'Foto & Vídeo',
  'Camaras_Vídeo_Acessorios': 'Foto & Vídeo',
  'Cartões Presente': 'Jogos & Consolas',
  'Colunas_de_Som': 'Som & Hi-Fi',
  'Conectividade': 'Informática, Portáteis e Tablets',
  'Consolas_Acessorios': 'Jogos & Consolas',
  'Consolas_de_Jogos': 'Jogos & Consolas',
  'Consumiveis_de_Gravacao': 'Informática, Portáteis e Tablets',
  'Discos_Acessórios': 'Informática, Portáteis e Tablets',
  'Discos_Externos': 'Informática, Portáteis e Tablets',
  'Discos_HDD': 'Informática, Portáteis e Tablets',
  'Discos_SSD': 'Informática, Portáteis e Tablets',
  'Drives_Ópticas': 'Informática, Portáteis e Tablets',
  'Drones': 'Drones',
  'Drones_Acessorios': 'Drones',
  'Equipamentos_GPS': 'Navegação GPS',
  'Equipamentos_GPS_Acessórios': 'Navegação GPS',
  'Gaming_PC_Acessórios': 'Jogos & Consolas',
  'HealthCare': 'Smartwatches',
  'Home_Cinema': 'TV, Home Cinema',
  'Home_Solutions': 'Domótica',
  'Impressoras_3D': 'Informática, Portáteis e Tablets',
  'Impressoras_3D_Consumiveis': 'Informática, Portáteis e Tablets',
  'Impressoras_Fotograficas': 'Informática, Portáteis e Tablets',
  'Impressoras_Jacto_Tinta_Consumiveis': 'Informática, Portáteis e Tablets',
  'Impressoras_Jacto_Tinta_Papeis': 'Informática, Portáteis e Tablets',
  'Impressoras_Jacto_de_Tinta_A4': 'Informática, Portáteis e Tablets',
  'Impressoras_Laser_Consumiveis': 'Informática, Portáteis e Tablets',
  'Impressoras_Laser_Cores_A4': 'Informática, Portáteis e Tablets',
  'Impressoras_Laser_Mono_A4': 'Informática, Portáteis e Tablets',
  'Jogos': 'Jogos & Consolas',
  'Memorias_Cartoes': 'Informática, Portáteis e Tablets',
  'Memorias_PCs': 'Informática, Portáteis e Tablets',
  'Memorias_Portateis': 'Informática, Portáteis e Tablets',
  'Memorias_USB': 'Informática, Portáteis e Tablets',
  'Monitores_TFT': 'Informática, Portáteis e Tablets',
  'Motherboards_Pcs': 'Informática, Portáteis e Tablets',
  'Multimedia': 'TV, Home Cinema',
  'PCs': 'Informática, Portáteis e Tablets',
  'PCs_Acessórios': 'Informática, Portáteis e Tablets',
  'Placas_Graficas': 'Informática, Portáteis e Tablets',
  'Portateis': 'Informática, Portáteis e Tablets',
  'Portateis_Acessorios': 'Informática, Portáteis e Tablets',
  'Power_Banks': 'Informática, Portáteis e Tablets',
  'Processadores': 'Informática, Portáteis e Tablets',
  'Ratos_para_PCs': 'Informática, Portáteis e Tablets',
  'Ratos_para_Portateis': 'Informática, Portáteis e Tablets',
  'Redes_Powerline': 'Informática, Portáteis e Tablets',
  'Redes_Routers': 'Informática, Portáteis e Tablets',
  'Redes_Switch': 'Informática, Portáteis e Tablets',
  'Redes_Wireless': 'Informática, Portáteis e Tablets',
  'Relógios_Desportivos': 'Smartwatches',
  'Relógios_Desportivos_Acessórios': 'Smartwatches',
  'SW_OFFICE': 'Informática, Portáteis e Tablets',
  'SW_Sistemas_Operativos': 'Informática, Portáteis e Tablets',
  'Sistemas_Audio': 'Som & Hi-Fi',
  'SmartBands': 'Smartwatches',
  'SmartBands_Acessórios': 'Smartwatches',
  'SmartPhones': 'Smartphones',
  'SmartPhones_Acessorios': 'Smartphones',
  'SmartWatch': 'Smartwatches',
  'SmartWatch_Acessorios': 'Smartwatches',
  'Smartphones': 'Smartphones',
  'Tablets': 'Informática, Portáteis e Tablets',
  'Tablets_Acessórios': 'Informática, Portáteis e Tablets',
  'Teclados': 'Informática, Portáteis e Tablets',
  'Teclados_e_Ratos': 'Informática, Portáteis e Tablets',
  'Televisores': 'TV, Home Cinema',
  'Televisores_Acessorios': 'TV, Home Cinema',
  'VideoProjectores': 'TV, Home Cinema',
  'Videoprojectores': 'TV, Home Cinema',
  'Videovigilância': 'Domótica',
  'WebCam': 'Informática, Portáteis e Tablets',
  'Workstation': 'Informática, Portáteis e Tablets'
};

// require('./nightmare-login-cpcdi')(nightmare); // Login na CPCDI

mongoose.Promise = Promise;
const ProductSchema = require('./product.schema');
const Product = mongoose.model('product', ProductSchema);

const uri = process.env.MONGO_URI;

const mongo = mongoose.connect(uri, {useMongoClient: true});

const app = express();

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));

app.get('/', (req, res) => {
  res.send({
    status: 'up',
    uptime: process.uptime()
  });
});

app.get('/products', (req, res) => {
  let queryObj = {};

  if (req.query.category && req.query.category.length > 0) {
    queryObj.category = req.query.category;
  }

  if (req.query.search && req.query.search.length > 0) {
    queryObj.$or = [
      {reference: new RegExp(req.query.search, 'gim')},
      {title: new RegExp(req.query.search, 'gim')},
    ];
  }

  if (req.query.star) {
    queryObj.star = true;
  }

  Product.count(queryObj)
    .then(count => {
      const skip = Number(req.query.skip) || 0;
      const limit = Number(req.query.limit) || 10;

      Product.find(queryObj, {specifications: 0, previousData: 0}).skip(skip).limit(limit)
        .then((products) => {
          res.send({
            products,
            count,
            skip,
            limit,
            queryObj,
            query: {
              skip,
              limit,
              search: req.query.search,
              star: req.query.star
            }
          });
        })
        .catch(console.error);
    });
});

app.get('/products/:productId', (req, res) => {
  Product.findOne({ _id: req.params.productId })
    .then((product) => {
      res.send({ product });
    })
});

app.put('/products/:productId', (req, res) => {
  Product.findById(req.params.productId)
    .then((product) => {
      const {
        createdOn,
        modifiedOn,
        reference,
        title,
        description,
        brand,
        category,
        subCategory,
        costPricePP,
        costPrice30Days,
        stock,
        specifications,
        imgUrl,
        noInfoOnCPCDI,
        user
      } = product;
      product.previousData.push({
        previousDataCreatedOn: new Date(),
        createdOn, modifiedOn, reference, title, description, brand, category,
        subCategory, costPricePP, costPrice30Days, stock, specifications, imgUrl, noInfoOnCPCDI, user
      });

      product.title = req.body.title;
      product.description = req.body.description;
      product.stock = req.body.stock;
      product.specifications = req.body.specifications;
      product.imgUrl = req.body.imgUrl;
      product.noInfoOnCPCDI = req.body.noInfoOnCPCDI;
      product.user = req.body.user;
      product.modifiedOn = Date.now();

      product.save()
        .then(newProduct => {
          res.send({ product: newProduct });
        })
        .catch(console.error);
    });
});

app.get('/categories', (req, res) => {
  Product.aggregate([
    {
      $group: {
        _id: '$category',
        subcategories: {$addToSet: '$subCategory'},
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        subcategories: 1,
        count: 1
      }
    }
  ])
    .then((result) => {
      const list = result.map(item => `${item.category}`);
      list.sort();
      res.send(list);
    })
});

app.get('/statistics', (req, res) => {
  Product.aggregate([
    {
      $group: {
        _id: '$user',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        user: '$_id',
        count: 1
      }
    }
  ])
    .then((result) => {
      res.send(result);
    })
});

app.get('/scrape-reference/:reference', (req, res) => {
  const ref = encodeURIComponent(req.params.reference);
  const url = `https://cpcdi.pt/Produtos/Referencia?referencia=${ref}`;

  console.log(`Tring to scrape ${url}`);

  nightmare
    .goto(url)
    .wait('h2.header-text')
    .click('#img_grande .img-responsive')
    .wait(500)
    .evaluate(() => ({
      imgUrl: document.querySelector('img.lb-image').src,
      tableProduct: document.querySelector('#tabelaFicha') ? document.querySelector('#tabelaFicha').outerHTML : ''
    }))
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send({error, msg: 'Error scapping page'});
    });
});

app.get('/export', (req, res) => {
  const query = {
  };

  const transformUrl = ({category, reference, title, brand}) => {
    const categoryEncoded = encodeURIComponent(category).toLowerCase();
    const ref = encodeURIComponent(reference).toLowerCase();
    const brandEncoded = encodeURIComponent(brand.toLowerCase().replace(/ /g, '-'));
    const titleEncoded = encodeURIComponent(title.substr(0, 20).toLowerCase().replace(/ /g, '-'));
    let url = `${categoryEncoded}-${brandEncoded}-${ref}-${titleEncoded}`;

    if (url[url.length-1] === '-') {
      url = url.slice(0, -1);
    }

    return url;
  };

  const transformTags = ({category, brand, subCategory, star}) => {
    const tags = [
      `Categoria_${categoryMap[category]}`,
      `Marca_${brand}`,
      `${subCategory}`
    ];

    if (star) {
      tags.push('Estrela');
    }

    return tags.join(', ');
  };

  const transformImgUrl = (imgUrl) => {
    if (imgUrl === 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==') {
      return 'https://static.bia.pt/w1bppnt6k5.png';
    }

    return imgUrl;
  };

  const transformDescription = ({ description, specifications }) => {
    return `<h5>Detalhes</h5><p>${description}</p><h5>Especificações</h5>${specifications}`;
  };

  const projecttion = { __v: 0, previousData: 0};
  Product.find(query, projecttion)
    .then((products) => {
      const result = products.map(product => ({
        'Handle': transformUrl(product),
        'Title': product.title,
        'Body (HTML)': transformDescription(product),
        'Vendor': 'bia.pt',
        'Type': '',
        'Tags': transformTags(product),
        'Published': 'TRUE',
        'Option1 Name': 'Title',
        'Option1 Value': 'Default Title',
        'Option2 Name': '',
        'Option2 Value': '',
        'Option3 Name': '',
        'Option3 Value': '',
        'Variant SKU': product.reference,
        'Variant Grams': '',
        'Variant Inventory Tracker': '',
        'Variant Inventory Qty': '1',
        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Price': Number(((product.costPrice30Days + 6) * 1.23).toFixed(2)),
        'Variant Compare At Price': Number(((product.costPrice30Days + 6) * 1.10 * 1.23).toFixed(2)),
        'Variant Requires Shipping': 'TRUE',
        'Variant Taxable': 'TRUE',
        'Variant Barcode': '',
        'Image Src': transformImgUrl(product.imgUrl),
        'Image Alt Text': product.imgUrl ? product.title : '',
        'Gift Card': 'FALSE',
        'Google Shopping / MPN': '',
        'Google Shopping / Age Group': '',
        'Google Shopping / Gender': '',
        'Google Shopping / Google Product Category': '',
        'SEO Title': '',
        'SEO Description': '',
        'Google Shopping / AdWords Grouping': '',
        'Google Shopping / AdWords Labels': '',
        'Google Shopping / Condition': '',
        'Google Shopping / Custom Product': '',
        'Google Shopping / Custom Label 0': '',
        'Google Shopping / Custom Label 1': '',
        'Google Shopping / Custom Label 2': '',
        'Google Shopping / Custom Label 3': '',
        'Google Shopping / Custom Label 4': '',
        'Variant Image': '',
        'Variant Weight Unit': ''
      }));

      res.send(result)
    })
});


app.listen(1337, () => {
  console.log(`Bia API running on port ${1337}!`);
});
