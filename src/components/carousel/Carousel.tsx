import React from "react";
import AliceCarousel from "react-alice-carousel";
import "./../../index.css";
import Modal from "react-modal";
import { faXmark, faLocationDot, faCity, faUpRightAndDownLeftFromCenter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { carouselObject, countryProps } from "../../types/types";
import "./Carousel.css";
import GalleryModal from "./innerComponents/GalleryModal";


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
  },
  overlay: {
    zIndex: 1000,
    backgroundColor: "rgba(255,255,255, 0.5)",
  },
};

const handleDragStart = (e: any) => e.preventDefault();

const formStatesCopy = {
  cityV: "",
  type: "",
  minBedr: "",
  maxBedr: "",
  maxPr: "",
  minPr: "",
  filtersStr: "",
  dist: "",
}

const Carousel = (props: countryProps) => {
  const dopNotBoolTest = [
    {
      title: "Первая линия",
      code: "first_line",
    },
    {
      title: "До 500 метров",
      code: "500_metrs",
    },
    {
      title: "Не важно",
      code: "dont",
    },
  ]
  const [cardsImageArr, setCardsImageArr] = React.useState([]);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [modalCardID, setModalCardID] = React.useState(0);
  const url = 'https://nadlan-abroad.world';
  const [clickedImageNumber, setClickedImageNumber] = React.useState(0);
  const [galleryModal, setGalleryModal] = React.useState(false);
  const [imagesGlobal, setImagesGlobal] = React.useState(Array<any>);
  const [imagesThumbs, setImagesThumbs] = React.useState(Array<any>);
  const [isSwipe, setIsSwipe] = React.useState(0);

  const [isCitySearch, setIsCitySearch] = React.useState(false);
  const [isCityList, setIsCityList] = React.useState(false);
  const [isCitySelected, setIsCitySelected] = React.useState(false);
  const [isDopsActive, setIsDopsActive] = React.useState(false);
  const [isCityClicked, setIsCityClicked] = React.useState(false);
  const [isCityInput, setIsCityInput] = React.useState(false);
  const [isFiltersSelect, setIsFiltersSelect] = React.useState(false);
  const [isSearchCkliked, setIsSearchCkliked] = React.useState(false);

  const [cityValue, setCityValue] = React.useState("");
  const [cityArr, setCityArr] = React.useState<any[]>([]);
  const [dopPreviewFilters, setDopPreviewFilters] = React.useState([]);
  const [dopFilters, setDopFilters] = React.useState<any[]>([]);

  const [minPriceValue, setMinPriceValue] = React.useState("");
  const [maxPriceValue, setMaxPriceValue] = React.useState("");
  const [minPriceValueR, setMinPriceValueR] = React.useState("");
  const [maxPriceValueR, setMaxPriceValueR] = React.useState("");

  
  const [filter, setFilter] = React.useState<string[]>([]);
  const [city, setCity] = React.useState("");
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(0);
  const [distance, setDistance] = React.useState("");

  const [filterString, setFilterString] = React.useState("");
  const [filtersCounter, setFiltersCounter] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const [minBedroomsValue, setMinBedroomsValue] = React.useState("");
  const [maxBedroomsValue, setMaxBedroomsValue] = React.useState("");

  const [minBedrooms, setMinBedrooms] = React.useState(0);
  const [maxBedrooms, setMaxBedrooms] = React.useState(0);

  const [isTypeSearch, setIsTypeSearch] = React.useState(false);
  const [isTypeList, setIsTypeList] = React.useState(false);
  const [isTypeSelected, setIsTypeSelected] = React.useState(false);
  const [isTypeClicked, setIsTypeClicked] = React.useState(false);
  const [isTypeInput, setIsTypeInput] = React.useState(false);
  const [typeValue, setTypeValue] = React.useState("");
  const [isTypeSearchCkliked, setIsTypeSearchCkliked] = React.useState(false);
  const [typeArr, setTypeArr] = React.useState<any[]>([]);
  const [type, setType] = React.useState("");

  // preview images from back
  const previewGetter = async () => {
    const response = await (await fetch(`${url}/api/cards/?` + new URLSearchParams({
      ctn: props.code,
    }))).json();
    return response;
  };

  // filters values from backend
  const infoGetter = async () => {
    const response = await(await fetch(`${url}/api/info/`)).json();
    return response;
  };


  // send filters function
  const filterSend = async () => {
    setIsLoading(true);
    setFiltersCounter(filtersCounter + 1);

    let sendObj:any = {
      ctn: props.code,
    }
    if (filter.length > 0) {
      sendObj.filters = filterString;
    }
    if (city !== '' && city !== 'nothing') {
      sendObj.city = city;
    }
    if (type !== '' && type !== 'nothing') {
      sendObj.type = type;
    }
    if (minBedroomsValue === "") {
      sendObj.min_bedrooms = `${minBedrooms}`;
    } else {
      sendObj.min_bedrooms = minBedroomsValue;
    }

    if (maxBedroomsValue === "") {
      sendObj.max_bedrooms = `${maxBedrooms}`;
    } else {
      sendObj.max_bedrooms = maxBedroomsValue;
    }


    if (minPriceValue === "") {
      sendObj.min_price = `${minPrice}`;
    } else {
      sendObj.min_price = minPriceValue;
    }

    if (maxPriceValue === "") {
      sendObj.max_price = `${maxPrice}`;
    } else {
      sendObj.max_price = maxPriceValue;
    }

    if (distance !== "") {
      sendObj.distances_to_the_sea = distance;
    }

    const response = await (await fetch(`${url}/api/cards/?` + new URLSearchParams(sendObj))).json(); 
    return response;
  }

  // reset filters function
  const filtersReset = () => {
    setCityValue("");
    setTypeValue("");
    setCity("");
    setType("");
    setMaxBedroomsValue("");
    setMinBedroomsValue("");
    setMaxPriceValue("");
    setMinPriceValue("");
    setMaxPriceValueR("");
    setMinPriceValueR("");
    setFilter([]);
    setFilterString("");
    setDistance("");
    setIsFiltersSelect(false);
    setIsCityInput(false);
    setIsTypeInput(false);

    formStatesCopy.cityV = "";
    formStatesCopy.type = "";
    formStatesCopy.dist = "";
    formStatesCopy.filtersStr = "";
    formStatesCopy.maxBedr = "";
    formStatesCopy.maxPr = "";
    formStatesCopy.minBedr = "";
    formStatesCopy.minPr = "";

    previewGetter().then((response) => {setCardsImageArr(response); setIsLoading(false)});
  }

  // checkboxes to string
  React.useEffect(() => {
    let string = "";
    if (filter.length > 0) {
      for (let i = 0; i < filter.length; i++) {
        const filterItem = filter[i];
        if (i === filter.length - 1) {
          string += filterItem
        } else {
          string += `${filterItem},`
        }
      }
      setFilterString(string);
    }
  }, [filter, setFilter]);

  // data from backend to states
  React.useEffect(() => {
    previewGetter().then((response) => {setCardsImageArr(response)});    
    infoGetter().then((response:any) => {
      setCityArr(() => {
        if (response.city[0].code !==  "nothing") {
          // add nothing value
          response.city.unshift({title: "כל המדינה", code: "nothing"});
        } 
        return response.city;
      })
      setTypeArr(() => {
        if (response.types[0].code !== "nothing") {
          // add nothing value
          response.types.unshift({title: " כל סוגי הנכסים", code: "nothing"});
        } 
        return response.types;
      })
      setDopPreviewFilters(response.filter.is_view);
      setDopFilters(response.filter.others);
      setMinPrice(response.min_price);
      setMaxPrice(response.max_price);
      setMinBedrooms(response.min_berooms);
      setMaxBedrooms(response.max_berooms);
    });    

    // dom 
    if (galleryModal) {
      document.body.classList.add("_lock");
    } else {
      document.body.classList.remove("_lock");
    }
    document.documentElement.addEventListener('click', (e:any) => {
      if (!e.target.closest('._city')) {
        setIsCitySearch(false);
        setIsCityClicked(false);
      }

      if (!e.target.closest('._type')) {
        setIsTypeSearch(false);
        setIsTypeClicked(false);
      }
      
      if (!e.target.closest('.filters__dop-btn') && !e.target.closest('.filters-dop')) {
        setIsDopsActive(false)
      }
    })
  }, []);

  // modal close/open
  const modalMove = () => {
    setModalIsOpen(!modalIsOpen);
    setClickedImageNumber(0);
  };

  // reset btn hide/show
  const resetHider = () => {
    if (
      formStatesCopy.cityV === ""
      && formStatesCopy.type === ""
      && formStatesCopy.minBedr === "" 
      && formStatesCopy.maxBedr === ""  
      && formStatesCopy.minPr === "" 
      && formStatesCopy.maxPr === ""  
      && formStatesCopy.filtersStr === ""
      && formStatesCopy.dist === ""
    ) {
      setIsFiltersSelect(false);
      return false;
    } else {
      setIsFiltersSelect(true);
      return true;
    }
  }

  // global img getter
  const imagesGlobalGetter = (id:number) => {    
    cardsImageArr.map((block: carouselObject, i:number) => {
      if (id === i) {
        const images = block.images.map((src: string, i: number) => {
          const imageUrl = new Image;
          let imgK;
          let imgClassName = "modal-image__wrap";

          imageUrl.src = `${url}/image/${src}`;
          return(
            imageUrl.onload = () => {
              imgK = imageUrl.width / imageUrl.height;
              if (imgK < 1 && !imgClassName.includes("modal-image__vert")) {
                imgClassName += " modal-image__vert";
              }
              return(
                <div className={imgClassName}>
                  <div className="modal-image__wrap-inner">
                    <img
                      key={i}
                      data-number={i + 1}
                      onClick={() => setGalleryModal(true)}
                      className="modal-image px-2.5 w-full h-[500px] object-cover"
                      src={`${url}/image/${src}`}
                      onDragStart={handleDragStart}
                      role="presentation"
                      alt="ישראל תמונות"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            }
          )
        });
        const imagesThumbs = block.images.map((src: string, i: number) => {
          return(
            <img
              key={i}
              data-number={i + 1}
              onClick={() => setGalleryModal(true)}
              className="modal-image px-2.5 w-full h-[500px] object-cover"
              src={`${url}/image/${src}`}
              onDragStart={handleDragStart}
              role="presentation"
              alt="ישראל תמונות"
              loading="lazy"
            />
          );
        });
        setImagesGlobal(images);
        setImagesThumbs(imagesThumbs);
      }
    })
  }

  const objects: Array<carouselObject> = cardsImageArr;

  const placesItems = objects.map((block: carouselObject, i:number) => (
    <div data-value={i}
      onMouseDown={(e) => setIsSwipe(e.pageX)}
      onMouseUp={(e) => setIsSwipe(Math.abs(isSwipe - e.pageX))}
      onClick={() => {
        if (isSwipe < 22) {
          modalMove();
          setModalCardID(i);
          imagesGlobalGetter(i);
        }
      }}

      className="objects-slider-slide mx-5 text-center duration-300 hover:translate-y-1.5 flex flex-col items-center hover:text-regal-blue"
    >
      <img
        className="w-full h-60 object-cover"
        src={`${url}/image/${block.preview}`}
        onDragStart={handleDragStart}
        role="presentation"
        alt="block-img"
        loading="lazy"
      />
      <div
        className="card-title-wrap px-2 pt-7 text-xl font-bold"
        dangerouslySetInnerHTML={{ __html: block.title }}
      ></div>
      <div
        className="card-desc-wrap px-2 py-5"
        dangerouslySetInnerHTML={{ __html: block.desc }}
      ></div>
      <button className="my-5 px-6 py-3 border border-regal-blue hover:px-12 duration-300 hover:bg-regal-blue hover:text-white text-regal-blue">
        מידע נוסף
      </button>
    </div>
  ));

  // carouseel modal content component
  const CarouselMContent = () => {
    let isSwipeLocal:number;    
    return (
      <div>
        {cardsImageArr.map((block: carouselObject, index: number) => {
          if (modalCardID === index) {
            const images = block.images.map((src: string, i: number) => {
              return (
                <div 
                  onMouseDown={(e) => isSwipeLocal = e.pageX}
                  onMouseUp={(e) => isSwipeLocal = Math.abs(isSwipeLocal - e.pageX)}
                  onClick={() => {
                    if (isSwipeLocal < 22) {
                      setGalleryModal(true);       
                      setClickedImageNumber(i); 
                    }
                  }}

                  className="alice-img-wrapper"
                >
                  <FontAwesomeIcon className="alice-img-wrapper__icon" icon={faUpRightAndDownLeftFromCenter} />
                  <img
                    className="px-2.5 w-full h-[500px] object-cover"
                    src={`${url}/image/${src}`}
                    onDragStart={handleDragStart}
                    role="presentation"
                    alt="ישראל תמונות"
                    loading="lazy"
                  />
                </div>
                
              );
            });

            return (
              <div className="modal-slider" key={index}>
                <section className="flex flex-col xl:w-[1036px] lg:w-[780px] max-h-screen w-screen items-center p-10">
                  <div
                    className="text-center font-bold text-2xl md:text-3xl pb-7"
                    dangerouslySetInnerHTML={{ __html: block.title }}
                  ></div>
                  <AliceCarousel
                    mouseTracking
                    activeIndex={clickedImageNumber}
                    //@ts-ignore
                    items={images}
                    autoPlay={true}
                    responsive={{
                      0: { items: 1 },
                    }}
                    infinite={true}
                    disableDotsControls={true}
                    autoPlayInterval={5000}
                  />
                  <div
                    dangerouslySetInnerHTML={{ __html: block.desc_main }}
                    className="carouseel-m-desc text-center md:text-base text-sm"
                  ></div>
                  <a
                    href="#feedback"
                    onClick={() => modalMove()}
                    className="mt-10 px-6 py-3 border border-regal-blue hover:px-12 duration-300 hover:bg-regal-blue hover:text-white text-regal-blue"
                  >
                    צור קשר
                  </a>
                </section>
                <button
                  className="absolute z-20 right-5 top-5"
                  onClick={modalMove}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="text-2xl hover:text-regal-red"
                  />
                </button>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const isFilter = (el:any, arr:any[]) => {
    for (let i = 0; i < arr.length; i++) {
      const arrEl = arr[i];
      if (arrEl === el) {
        return true;
      } else if (i === arr.length - 1) {
        return false;
      }
    }
  }

  return (
    <>
      <GalleryModal 
        galleryModal={galleryModal} 
        setGalleryModal={setGalleryModal}
        images={imagesGlobal}
        imagesThumbs={imagesThumbs}
        clickedImageNum={clickedImageNumber}
      />

    <section className="objects-carousel px-10 relative pt-5 pb-5">
      <div id="objects" className="absolute -top-28"></div>
      <div className="container mx-auto w-full">
        <div className="flex flex-col items-center py-8">
          <h1 className="text-center w-full md:text-4xl text-3xl text-regal-blue pb-4">
            נכסי הנדל"ן הרלוונטיים שברשותנו
          </h1>
          <p className="md:w-2/3 w-full font-bold text-center text-xl">
            !רכשו את הטוב ביותר, המחיר נשכח והאיכות נשארת
          </p>
        </div>
        <form className="filters">
          <div className="filters__row">
            <div className="filters__container">
                <label onClick={() => setIsCitySearch(true)} className="filters__wrap filters__wrap-i filters__wrap-city _city">
                  <FontAwesomeIcon onClick={() => setIsCityClicked(!isCityClicked)} className="filters__home-ico filters__city-ico" icon={faLocationDot} />
                  <div className="filters__input-city-wrap">
                    <input onInput={(e:any) => {
                        setIsCitySearch(true); 
                        setIsCitySelected(false);
                        setCityValue(e.target.value);
                        formStatesCopy.cityV = e.target.value;
                        
                        if (e.target.value !== "") {
                          setIsCityInput(true);
                        } else {
                          setIsCityInput(false); 
                        }
                        resetHider();
                          
                        for (let i = 0; i < cityArr.length; i++) {
                          const str = cityArr[i].title.toLowerCase().replace(/\s+/g, '');
                          if (str === e.target.value.toLowerCase().replace(/\s+/g, '')) {
                            setCity(cityArr[i].code);
                          }
                          if (str.includes(e.target.value.toLowerCase().replace(/\s+/g, ''))) {
                            setIsCityList(false);
                            break;
                          }
                          if (i === cityArr.length - 1 && !str.includes(e.target.value)) {
                            setIsCityList(true);
                          }
                        }
                      }} 
                      type="text" className="filters__input-city text-right"
                      placeholder="ישוב, שכונה" 
                      value={cityValue}
                    />
                    <FontAwesomeIcon 
                      className={isCityInput ? "filters__input-city-cross _active" : "filters__input-city-cross"} 
                      onClick={() => {
                        setCityValue("");
                        setCity("");
                        setIsCitySelected(false);
                        setIsCityInput(false);
                        formStatesCopy.cityV = "";
                        resetHider();
                      }}
                      icon={faXmark} 
                    />
                  </div>
                  
                  
                  <div className={isCitySearch && (cityValue !== '') && !isCitySelected || isCityClicked ? "filters__cities _active" : "filters__cities"}>
                    {
                      isCityList ? 
                      <p className="filters__city filters__city-not text-right">אין רשומות להציג</p>
                      :
                      cityArr.map(({title, code}) => {
                        return(
                          title.toLowerCase().replace(/\s+/g, '').includes(cityValue.toLowerCase().replace(/\s+/g, '')) &&
                          <p 
                          data-title={title} className="filters__city text-right"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCityValue(title);
                            formStatesCopy.cityV = title;
                            setCity(code);
                            setIsCitySelected(true);
                            setIsFiltersSelect(true);
                            setIsCityInput(true);
                          }}
                          >{title}</p> 
                        )
                      })
                    }
                  </div>
                </label>

                {/* <div onClick={() => setIsTypesActive(!isTypesActive)} className="filters__wrap filters__wrap-i filters__wrap-type _type">
                  <div className="filters__popup-wrap">
                    <h5 className="filters__popup">{typeValue}</h5>
                    <FontAwesomeIcon icon={faCity} />
                  </div>
                  <FontAwesomeIcon className={isTypesActive ? "filters__popup-arrow _active" : "filters__popup-arrow"} 
                    icon={faAngleDown} 
                  />
                  
                  <div onClick={(e) => e.stopPropagation()}
                  className={isTypesActive ? "filters__cities filters__type-list _active" : "filters__type-list filters__cities"}>
                    {
                      types.map((el:any) => {
                        return(
                          <p onClick={() => {
                            setTypeValue(el.title);
                            setHouseType(el.code);
                            formStatesCopy.type = el.code;
                            resetHider();
                            setIsTypesActive(false);
                            setIsFiltersSelect(true);
                          }} 
                          data-value={el.code} className="filters__type filters__city text-right">{el.title}</p>
                        )
                      })
                    }
                  </div>
                </div> */}

                <label onClick={() => setIsTypeSearch(true)} className="filters__wrap filters__wrap-i filters__wrap-city _type">
                  <FontAwesomeIcon onClick={() => setIsTypeClicked(!isTypeClicked)}
                  className="filters__home-ico filters__city-ico" icon={faCity} />
                  <div className="filters__input-city-wrap">
                    <input onInput={(e:any) => {
                        setIsTypeSearch(true); 
                        setIsTypeSelected(false);
                        setTypeValue(e.target.value);
                        formStatesCopy.type = e.target.value;
                        
                        if (e.target.value !== "") {
                          setIsTypeInput(true);
                        } else {
                          setIsTypeInput(false); 
                        }
                        resetHider();
                          
                        for (let i = 0; i < typeArr.length; i++) {
                          const str = typeArr[i].title.toLowerCase().replace(/\s+/g, '');
                          if (str === e.target.value.toLowerCase().replace(/\s+/g, '')) {
                            setType(typeArr[i].code);
                          }
                          if (str.includes(e.target.value.toLowerCase().replace(/\s+/g, ''))) {
                            setIsTypeList(false);
                            break;
                          }
                          if (i === typeArr.length - 1 && !str.includes(e.target.value)) {
                            setIsTypeList(true);
                          }
                        }
                      }} 
                      type="text" className="filters__input-city text-right"
                      placeholder="סוג נכס" 
                      value={typeValue}
                    />
                    <FontAwesomeIcon 
                      className={isTypeInput ? "filters__input-city-cross _active" : "filters__input-city-cross"} 
                      onClick={() => {
                        setTypeValue("");
                        setType("");
                        setIsTypeSelected(false);
                        setIsTypeInput(false);
                        formStatesCopy.type = "";
                        resetHider();
                      }}
                      icon={faXmark} 
                    />
                  </div>
                  
                  <div className={isTypeSearch && (typeValue !== '') && !isTypeSelected || isTypeClicked ? "filters__cities _active" : "filters__cities"}>
                    {
                      isTypeList ? 
                      <p className="filters__city filters__city-not text-right">אין רשומות להציג</p>
                      :
                      typeArr.map(({title, code}) => {
                        return(
                          title.toLowerCase().replace(/\s+/g, '').includes(typeValue.toLowerCase().replace(/\s+/g, '')) &&
                          <p 
                          data-title={title} className="filters__city text-right"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTypeValue(title);
                            formStatesCopy.type = title;
                            setType(code);
                            setIsTypeSelected(true);
                            setIsFiltersSelect(true);
                            setIsTypeInput(true);
                          }}
                          >{title}</p> 
                        )
                      })
                    }
                  </div>
                </label>

                <div className="filters__wrap _price _bedrooms">
                  <h5 className="filters__name text-right">חדרים</h5>
                  <div className="filters__price-wrap">
                    <div className="Quiz_formPriceWrapper__gL4Kk filters__input-price">
                      <p className="Quiz_formPriceTitle__RXdo- top-text">עד</p>
                      <input onInput={(e:any) => {
                        formStatesCopy.maxBedr = e.target.value;
                        resetHider();
                        setMaxBedroomsValue(e.target.value);
                      }}
                      name="maxPrice" type="number"
                      className="Quiz_formPrice__YqLnd text-right" value={maxBedroomsValue} />
                    </div>
                    <div className="Quiz_formPriceWrapper__gL4Kk filters__input-price">
                      <p className="Quiz_formPriceTitle__RXdo- top-text">מ</p>
                      <input onInput={(e:any) => {
                        formStatesCopy.minBedr = e.target.value;
                        resetHider();
                        setMinBedroomsValue(e.target.value)
                      }}
                      name="minPrice" type="number"
                      className="Quiz_formPrice__YqLnd text-right" value={minBedroomsValue} />
                    </div>
                  </div>
                </div>

                <div className="filters__wrap _price">
                  <h5 className="filters__name text-right">מחיר</h5>
                  <div className="filters__price-wrap">
                    <div className="Quiz_formPriceWrapper__gL4Kk filters__input-price">
                      <p className="Quiz_formPriceTitle__RXdo- top-text">עד</p>
                      <input onInput={(e:any) => {
                          setMaxPriceValue(() => {
                            let str = e.target.value;
                            str = str.replace(/[\s.,%]/g, '');
                            return str;
                          }); 
                          formStatesCopy.maxPr = e.target.value;
                          resetHider();
                          setMaxPriceValueR(() => {
                            let str = e.target.value;
                            str = str.replace(/[^0-9.]/g,'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return str;
                          })
                        }}
                        name="maxPrice" type="text"
                        className="Quiz_formPrice__YqLnd text-right" 
                        value={maxPriceValueR} 
                      />
                    </div>
                    <div className="Quiz_formPriceWrapper__gL4Kk filters__input-price">
                      <p className="Quiz_formPriceTitle__RXdo- top-text">מ</p>
                      <input onInput={(e:any) => {        
                        setMinPriceValue(() => {
                          let str = e.target.value;
                          str = str.replace(/[\s.,%]/g, '');
                          return str;
                        }); 
                        formStatesCopy.minPr = e.target.value;
                        resetHider();
                        setMinPriceValueR(() => {
                          let str = e.target.value;
                          str = str.replace(/[^0-9.]/g,'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          return str;
                        })
                      }}
                      name="minPrice" type="text"
                      className="Quiz_formPrice__YqLnd text-right" value={minPriceValueR} />
                    </div>
                  </div>
                </div>
            </div>
            <div className="filters__buttons">
              <button onClick={(e) => {
                e.preventDefault();
                filterSend().then((response) => {
                    setCardsImageArr(response);
                    setIsLoading(false);
                  });

                  if (resetHider()) {
                    setIsSearchCkliked(true);
                    setIsTypeSearchCkliked(true);
                  } else {
                    setIsSearchCkliked(false);
                    setIsTypeSearchCkliked(false);
                  }
                }} 
                className="filters__send"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
              <button type="reset" 
                onClick={() => {
                  filtersReset();
                  setIsSearchCkliked(false);
                  setIsTypeSearchCkliked(false);
                  setIsLoading(true);
                }} 
                className= {isFiltersSelect || isSearchCkliked || isTypeSearchCkliked ? "filters__reset _active" : "filters__reset"} 
              >
                נקה חיפוס
              </button>
            </div>
            
          </div>

          <div className="filters__dop-wrap">
            <div className="filters__dop-wrap-inner">
              {/* <button onClick={(e) => {setIsDopsActive(!isDopsActive); e.preventDefault()}} className="filters__dop-btn">
                <FontAwesomeIcon className="filters__dop-btn-icon" icon={faSliders} />
                <span className="filters__dop-btn-txt">Дополниельно</span>
              </button> */}
              <div className="filters__dop-preview">
                {
                  dopPreviewFilters.map((el:any) => {
                    return(
                      <label
                        onMouseDown={() => {
                          let copyArr:any[] = [];
                          Object.assign(copyArr, filter);
                          let elCode = el.code;
                          let isFilterYes = isFilter(el.code, copyArr);
                          if (isFilterYes) {
                            copyArr = copyArr.filter((elem) => elem !== elCode); 
                          } else {
                            copyArr.push(el.code);
                          }
                          
                          formStatesCopy.filtersStr = copyArr.length > 0 ? "selected" : "";
                          setFilter(copyArr);
                          resetHider();
                        }}
                        className="filters__dop"
                      >
                        <span className="filters__dop-txt">{el.title}</span>
                        <input type="checkbox" className="filters__dop-input" />
                      </label>
                    )
                  })
                }
              </div>
            </div>
            
            {/* <div className={isDopsActive ? "filters__dop-popup filters-dop _active" : "filters__dop-popup filters-dop"}>
              <div className="filters-dop__item">
                <h6 className="filters-dop__title text-right">Расстояние до моря</h6>
                <div className="filters-dop__list">
                  {
                    dopNotBoolTest.map((el) => {
                      return(
                        <label className="filters__dop-select">
                          <input 
                            onClick={() => {
                              formStatesCopy.dist = el.code;
                              resetHider();
                              if (el.code !== "dont") {
                                setDistance(el.code);
                              } else {
                                setDistance("");
                              }
                            }}
                            value={el.code} name="name1" type="radio" className="filters__dop-select-radio" 
                          />
                          <span className="filters__dop-select-btn">{el.title}</span>
                        </label>
                      )
                    })
                  }
                  
                </div>
              </div>


              <div className="filters-dop__item">
                <h6 className="filters-dop__title text-right">Особенности</h6>
                <div className="filters-dop__list">
                  {
                    dopFilters.map((el) => {
                      return(
                        <label
                          onMouseDown={() => {
                            let copyArr:any[] = [];
                            Object.assign(copyArr, filter);
                            let elCode = el.code;
                            let isFilterYes = isFilter(el.code, copyArr);
                            if (isFilterYes) {
                              copyArr = copyArr.filter((elem) => elem !== elCode); 
                            } else {
                              copyArr.push(el.code);
                            }

                            formStatesCopy.filtersStr = copyArr.length > 0 ? "selected" : "";
                            setFilter(copyArr);
                            resetHider();
                          }}
                          className="filters__dop"
                        >
                          <span className="filters__dop-txt">{el.title}</span>
                          <input type="checkbox" className="filters__dop-input" />
                        </label>
                      )
                    })
                  }
                  
                </div>
              </div>
            </div> */}
          </div>
        </form>
        {
          isLoading ? <div className="slider-nothing">טוען נתונים</div>
          : 
            cardsImageArr.length === 0 ? filtersCounter > 0 ? 
              <div className="slider-nothing">אין רשומות להציג</div>
              : 
              <div className="slider-nothing">טוען נתונים</div>
            : 
            <div className={placesItems.length === 1 ? "objects-slider-wrap _mini" : "objects-slider-wrap"} >
              <AliceCarousel
                mouseTracking
                items={placesItems}
                autoPlay
                responsive={{
                  640: { items: 1 },
                  1024: { items: 2 },
                  1280: { items: 4 },
                }}
                infinite
                disableDotsControls
                autoPlayInterval={5000}
              />
            </div>
            
        }
        
        <Modal
          //@ts-ignore
          isOpen={modalIsOpen}
          onRequestClose={modalMove}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Modal"
        >
          <CarouselMContent />
        </Modal>
      </div>
    </section>
    </>
    
  );
};

export default Carousel;