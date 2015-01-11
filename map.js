var areaMap = (function() {
    var AreaBlock = function(opption) {
        var anjukeMapStyle = [{
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#dceaf7"
            }
        }, {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": "#d9ead3"
            }
        }, {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "color": "#f2ebe5"
            }
        }, {
            "featureType": "highway",
            "elementType": "all",
            "stylers": {
                "color": "#ffffff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#d7d0c7"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#aca481"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#f2ebe5"
            }
        }, {
            "featureType": "arterial",
            "elementType": "all",
            "stylers": {
                "color": "#ffffff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#aea9a9"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#fbf2d9"
            }
        }, {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
                "color": "#ffffff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999"
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "lightness": 50
            }
        }, {
            "featureType": "subway",
            "elementType": "labels",
            "stylers": {
                "lightness": 70
            }
        }, {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": {
                "lightness": 45
            }
        }, {
            "featureType": "label",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#c3b2a0"
            }
        }, {
            "featureType": "boundary",
            "elementType": "geometry",
            "stylers": {
                "color": "#f1c232"
            }
        }]

        var defOpts = {
                lng: comm_info.comm_lng,
                lat: comm_info.comm_lat,
                id: 'map_container',
                zoom: 16,
                minz: 11,
                maxz: 18,
                nav: false,
                name: comm_info.comm_name
            },
            opts, map, container, DATA, EVENT, VIEW, point, chks, defBlock, mappopContent, mappopTitle, dom_h = 0,
            mapTitle, mapTitleLength;

        loadSource(init);

        function init() {
            /* 弹出地图start*/
            mappopContent = J.g('mappop_content');
            container = J.g("map_container");

            mappopTitle = J.g('mappop_content').s('h5').eq(0);
            mappopTitle.html(comm_info.comm_name);
            mapTitle = J.g('map_tab_title').s('li');
            mapTitleLength = mapTitle.length;
            opts = J.mix(defOpts, opption || {})
            map = new J.map.bmap(opts);
            map.enableScrollWheelZoom();
            map.setMapStyle(anjukeMapStyle);
            popMap();
            bindEvent();
            changeHeight();
            window.onresize = function() {
                changeHeight();
            }
            var mvc = new MVC();
            DATA = mvc.Data;
            VIEW = mvc.View;
            EVENT = mvc.Event;
            point = new BMap.Point(opts.lng, opts.lat);
            addOverlay();
        }

        function loadSource(callback) {
            var version = '2.0';
            (function() {
                callback();
                map.moveToCenter = function() {
                    //map.setCenter(opts.lng, opts.lat, opts.zoom);
                };
            }).require('map.Bmap', '')
        }

        function changeHeight() {
            var sClientHeight=document.documentElement.clientHeight||document.body.clientHeight;
            if (sClientHeight< 700) {
                mappopContent.removeClass('mappop_content');
                mappopContent.addClass('mappop_content_small');
                var smallHeight = document.documentElement.clientHeight - 317;
                if(smallHeight>0){
                    J.g("map_container").get().style.height=smallHeight+'px';
                } 
            } else {
                mappopContent.removeClass('mappop_content_small');
                mappopContent.addClass('mappop_content');
                J.g("map_container").get().style.height="340px";
            }
        }

        function popMap() {
            var mapClose = J.g('map_close');
            var mapBg = J.g('mappop-content-background');
            var mapContent = J.g('mappop_content');
            var mapIframe = J.g('mappop-iframe');
            J.g(document).on('click', function(e) {
                var e = e || window.event;
                var target = e.target || e.srcElement;
                if ((("string" === typeof target.className) && (target.className.indexOf('show_prop') > -1)) || (("string" === typeof target.className) && (target.className.indexOf('lifex') > -1))) {
                    popMapHandler(J.g(target));
                    document.body.style.overflow = "hidden";
                    J.s('html').eq(0).setStyle({
                        "overflow": "hidden"
                    });
                    var tt = J.g(target).attr('data-type');
                    J.g(tt).get().click();
                }
            });
            mapClose.on('click', function() {
                mapIframe.setStyle({
                    display: "none"
                })
                mapBg.setStyle({
                    display: "none"
                })
                mapContent.setStyle({
                    display: "none"
                })
                document.body.style.overflow = "auto";
                J.s('html').eq(0).setStyle({
                    "overflow": "auto"
                });
            })

            function popMapHandler(item) {
                J.site.trackEvent('showMapPop');
                var tab = 0;

                var mapBg = J.g('mappop-content-background');
                var mapContent = J.g('mappop_content');
                var attrId = item.attr("data-type");
                //item.click=J.g('attrId').click;
                for (var i = 0; i < mapTitleLength; i++) {
                    mapTitle.eq(i).removeClass("active");
                    //EVENT.clearCache();
                    //EVENT.tabCancled.call(mapTitle.eq(i), mapTitle.eq(i));
                }
                for (var i = 0; i < mapTitleLength; i++) {
                    if (mapTitle.eq(i).attr('data-attr') == attrId) {
                        mapTitle.eq(i).addClass("active");
                        //EVENT.tabclicked.call(item, attrId);
                    }
                }

                if (J.g('mappop-content').length && J.g('mappop-content-background').length) {
                    J.g("mappop-content").remove();
                    J.g("mappop-content-background").remove();
                }
                mapIframe.setStyle({
                    display: "block"
                })
                mapBg.setStyle({
                    display: "block"
                })
                mapContent.setStyle({
                    display: "block"
                })
            }
        }

        function addOverlay() {
            var params = J.mix({}, opts);
            params.x = -22;
            params.y = -42;
            params.zIndex = 2,
            params.className = 'overlay_comm'
            params.html = '<div class="font_14">' + opts.name + '<span class="icon_map tip"></span></div>';
            map.setCenter(params.lng, params.lat, params.zoom);
            map.addOverlay(params);
        }

        function bindEvent() {
            var zoomIn;
            var zoomOut;
            var _proMap = map;
            zoomIn = mappopContent.s(".btn_zoomin").eq(0)
            zoomOut = mappopContent.s(".btn_zoomout").eq(0)
            zoomIn.on('click', function() {
                _proMap.getMap().zoomIn();
            })
            zoomOut.on('click', function() {
                _proMap.getMap().zoomOut();
            })
            mapTitle.each(function(k, v) {
                v.on('click', function(e) {
                    mapTitle.each(function(e, l) {
                        l.removeClass('active')
                        EVENT.tabCancled.call(this, e);
                    })
                    v.addClass('active');
                    EVENT.tabclicked.call(this, e);
                })
            })
        }

        function MVC() {
            var CACHE = {
                    traffic: {
                        target: null,
                        nodes: {},
                        overlays: [],
                        data: null
                    },
                    school: {
                        target: null,
                        nodes: {},
                        overlays: [],
                        data: null
                    },
                    hospital: {
                        target: null,
                        nodes: {},
                        overlays: [],
                        data: null
                    },
                    commerce: {
                        target: null,
                        nodes: {},
                        overlays: [],
                        data: null
                    }
                },
                DATA, VIEW, EVENT, list;

            function init() {
                DATA = new Data();
                VIEW = new View();
                EVENT = new Event();
                list = J.g('tab_content');
            }
            init();

            function View() {
                //创建基本（学校医院）的tab列表ul元素
                function buildBaseHtml(type, params) {
                    var ul, cache, title;
                    var pos = [];
                    cache = CACHE[type].nodes;
                    ul = document.createElement('ul');
                    ul.className = "item" + type;
                    ul.id = "map_tab_content";
                    J.each(params, function(k, v) {
                        var li, distance;
                        distance = v.distance + "米";
                        li = document.createElement("li");
                        li.className = 'map_' + type;
                        li.innerHTML = '<i class="icon_map tip"></i><div class="map_list_left"><a>' + v.title + '</a>' +
                            (!v.address ? '' : '&nbsp;-&nbsp;<span>' + v.address + '</span>') +
                            '</div><em class="distance">' + distance + '</em>';
                        J.g(li).on('mouseenter', EVENT.listItemMouseOver);
                        J.g(li).on('mouseleave', EVENT.listItemMouseOut);
                        buildOverlay(type, v, li);
                        pos.push(v.point);
                        ul.appendChild(li);
                    })
                    pos.push(point);
                    CACHE[type].viewport = map.getViewport(pos);
                    map.setViewport(CACHE[type].viewport);
                    ul.style.display = 'block';
                    list.html(ul);
                    if(J.g(ul).html()==""){
                        J.g(ul).html('<span class="none_info">暂无数据</span>')
                    }
                    return ul;
                }

                //创建地图Overlay元素
                function buildOverlay(type, v, li) {
                    if (!v.point) return;
                    v.className = "overlay";
                    v.html = '<div class="icon_map ' + type + '"></div>';
                    v.lat = v.point.lat;
                    v.lng = v.point.lng;
                    v.x = -14;
                    v.y = -37;
                    v.zIndex = 1;
                    var tmp = map.addOverlay(v);
                    li.relatedTarget = tmp;
                    tmp.relatedTarget = li;
                    tmp.onMouseOver = EVENT.listItemMouseOver;
                    tmp.onMouseOut = EVENT.listItemMouseOut;
                    if (type == "sub" || type == "bus") {
                        CACHE["traffic"].overlays.push(tmp);
                    } else if (type == "restaurant" || type == "bank" || type == "supermarket") {
                        CACHE["commerce"].overlays.push(tmp);
                    } else {
                        CACHE[type].overlays.push(tmp);
                    }
                }


                //创建交通tab列表ul元素
                function buildTrafficHtml(sub, bus) {
                    var ul, cache, title, li, distance;
                    var pos = [];
                    var type = 'traffic';
                    var subType = 'sub';
                    var busType = 'bus';
                    ul = document.createElement('ul');
                    ul.className = "item" + type;
                    ul.id = "map_tab_content";
                    cache = CACHE[type].nodes;
                    buildChildHtml(type, sub, subType, ul, pos);
                    buildChildHtml(type, bus, busType, ul, pos);
                    CACHE[type].viewport = map.getViewport(pos);
                    map.setCenter(opts.lng, opts.lat, CACHE[type].viewport.zoom);
                    list.html(ul);
                    if(J.g(ul).html()==""){
                        J.g(ul).html('<span class="none_info">暂无数据</span>')
                    }
                    return ul;
                }

                //创建商业tab列表ul元素
                function buildCommerceHtml(restaurant, bank, supermarket) {
                    var ul, cache, title, li, distance;
                    var type = 'commerce';
                    var resType = 'restaurant';
                    var bankType = 'bank';
                    var supType = 'supermarket';
                    var pos = [];
                    ul = document.createElement('ul');
                    ul.className = "item" + type;
                    ul.id = "map_tab_content";
                    cache = CACHE[type].nodes;
                    buildChildHtml(type, restaurant, resType, ul, pos);
                    buildChildHtml(type, bank, bankType, ul, pos);
                    buildChildHtml(type, supermarket, supType, ul, pos);
                    CACHE[type].viewport = map.getViewport(pos);
                    map.setCenter(opts.lng, opts.lat, CACHE[type].viewport.zoom);
                    list.html(ul);
                    if(J.g(ul).html()==""){
                        J.g(ul).html('<span class="none_info">暂无数据</span>')
                    }
                    return ul;
                }
                //创建基本的有子类的tab列表元素，公共
                function buildChildHtml(type, childData, sType, ul, pos) {
                    J.each(childData, function(k, v) {
                        distance = v.distance + "米";
                        li = document.createElement("li");
                        li.className = 'map_' + sType;
                        li.innerHTML = '<i class="icon_map tip"></i><div class="map_list_left"><a>' + v.title + '</a>' +
                            (!v.address ? '' : '&nbsp;-&nbsp;<span>' + v.address + '</span>') +
                            '</div><em class="distance">' + distance + '</em>';
                        J.g(li).on('mouseenter', EVENT.listItemMouseOver);
                        J.g(li).on('mouseleave', EVENT.listItemMouseOut);
                        buildOverlay(sType, v, li);
                        pos.push(v.point);
                        ul.appendChild(li);
                    })
                }

                //获取交通数据
                function getTraffic(sub, bus) {
                    var type = 'traffic';
                    var target;
                    CACHE[type].target = target = buildTrafficHtml(sub, bus);
                }
                //获取学校数据
                function getSchool(data) {
                    var type = 'school';
                    var target;
                    CACHE[type].target = target = buildBaseHtml(type, data);
                }
                //获取医院数据
                function getHospital(data) {
                    var type = 'hospital';
                    var target;
                    CACHE[type].target = target = buildBaseHtml(type, data);
                }
                //获取商业数据
                function getCommerce(restaurant, bank, supermarket) {
                    var type = 'commerce';
                    var target;
                    CACHE[type].target = target = buildCommerceHtml(restaurant, bank, supermarket);
                }


                var handlers = {
                    getTraffic: getTraffic,
                    getSchool: getSchool,
                    getHospital: getHospital,
                    getCommerce: getCommerce
                }


                return handlers;
            }

            function Event() {
                var cenPoint = point;
                //列表鼠标移入
                function listItemMouseOver() {
                    var node, overlay;
                    if (!this.nodeType) {
                        node = this.relatedTarget;
                        overlay = this;
                    } else {
                        node = this;
                        overlay = this.relatedTarget;
                    }
                    J.g(node).addClass('maphover');
                    overlay._div.addClass('maphover');
                    overlay._div.setStyle({
                        "zIndex": "3"
                    })
                    //todo::
                    if (! this.nodeType) {
                        J.g(node).length && J.g('map_tab_content').length && myScroll.jumpTo(J.g('map_tab_content').get(), J.g(node).get());
                    }

                    if (!overlay.infoWindow) {
                        var params = J.mix({}, overlay.p);
                        params.html = '<div class="overlay_container"><span class="icon_map tip"></span><b>' + params.title + '</b><div>' + params.distance + '米，步行' + parseInt(params.distance / 75) + '分钟</div></div>';
                        params.className = 'overlay_info';
                        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                            params.y = -101;
                            params.x = -25;
                        } else {
                            params.y = -101;
                            params.x = -35;
                        }
                        params.zIndex = 10000;
                        overlay.infoWindow = map.addOverlay(params);
                        infoWindowToView(overlay.infoWindow, params);
                        return;
                    }
                    overlay.infoWindow.show();
                    infoWindowToView(overlay.infoWindow, overlay.infoWindow.p);
                }
                //列表鼠标移除
                function listItemMouseOut() {
                    var node, overlay;
                    if (!this.nodeType) {
                        node = this.relatedTarget;
                        overlay = this;
                    } else {
                        node = this;
                        overlay = this.relatedTarget;
                    }
                    J.g(node).removeClass('maphover');
                    overlay._div.removeClass('maphover');
                    overlay._div.setStyle({
                        "zIndex": "1"
                    })
                    overlay.infoWindow && overlay.infoWindow.hide();
                }
                //tab点击
                function tabclicked() {
                    var tabName = this.id || this.attr('id') || this.attr("data-type");
                    if (CACHE[tabName].target) {
                        list.html(CACHE[tabName].target);
                        J.each(CACHE[tabName].overlays, function(k, v) {
                            v.show();
                        })
                        J.g('scrollBarIndex').length&&J.g('scrollBarIndex').setStyle({'top':"0px"});
                    } else {
                        tabName = 'get' + tabName.charAt(0).toUpperCase() + tabName.substring(1);
                        DATA[tabName](function(data) {
                            if (Array.prototype.slice.call(arguments).length == 0) {
                                list.html('<span class="none_info">暂无数据</span>');
                            } else {
                                VIEW[tabName].apply(this, Array.prototype.slice.call(arguments));
                            }
                            J.g('map_tab_content').length && myScroll.jsScroll(J.g('map_tab_content').get());
                        });
                    }
                }
                //tab点击取消
                function tabCancled() {
                    var tabName = this.attr('id') || this.attr("data-type");
                    CACHE[tabName].target && J.g(CACHE[tabName].target).remove();
                    J.each(CACHE[tabName].overlays, function(k, v) {
                        v.hide();
                    })
                }
                // 将消息框移到可视区域
                function infoWindowToView(elm, data) {
                    var WH = map.getMapWH(),
                        position = map.pointToPixel(data.latlng),
                        y = parseInt(position.y),
                        x = parseInt(position.x);

                    var x1 = x + data.x;
                    var y1 = y + data.y;

                    var left = {
                        x: x1,
                        y: y1
                    }
                    var w = elm.get().width();
                    var h = elm.get().height();
                    var right = {
                        x: x1 + w,
                        y: y
                    }
                    var panX = 0;
                    var panY = 0;
                    var tmp = 0;

                    if (left.x < 0) {
                        panX = left.x;
                    }
                    if ((right.x - WH.width) > 0) {
                        panX = right.x - WH.width;
                    }

                    if (left.y < 0) {
                        panY = left.y;
                    }
                    if ((right.y - WH.height) > 0) {
                        panY = right.y - WH.height;
                    }
                    var centerPoint = map.getCenter();
                    var centerPosition = map.pointToPixel(centerPoint);
                    var c_x = centerPosition.x;
                    var c_y = centerPosition.y;
                    c_x = c_x + panX;
                    c_y = c_y + panY;
                    var ret_point = map.pixelToPoint(new BMap.Pixel(c_x, c_y));
                    map.getMap().setCenter(ret_point);
                }
                //清除所有的缓存CACHE数据
                function clearCache() {
                    J.each(CACHE, function(k, v) {
                        v.target = null;
                        v.nodes = {};
                        v.overlays = [];
                    })
                }
                return {
                    listItemMouseOver: listItemMouseOver,
                    listItemMouseOut: listItemMouseOut,
                    tabclicked: tabclicked,
                    tabCancled: tabCancled,
                    clearCache: clearCache,
                    infoWindowToView: infoWindowToView
                }

            }

            function Data() {
                function getDataCommon(type, callback) {
                    map.localSearchNearby(type, function(data) {
                        J.each(data, function(k, v) {
                            v.address = v.address == v.undefined ? '' : v.address;
                            v.distance = parseInt(map.getDistance(point, v.point))
                        })
                        data.sort(function(a, b) {
                            if (a.distance < b.distance) {
                                return -1;
                            }
                            if (a.distance == b.distance) {
                                return 0;
                            }
                            if (a.distance > b.distance) {
                                return 1
                            }
                        })
                        callback(data);
                    }, 10, 1000)
                }
                function getDataHospital(type, callback) {
                    map.localSearchNearby(type, function(data) {
                        J.each(data, function(k, v) {
                            v.address = v.address == v.undefined ? '' : v.address;
                            v.distance = parseInt(map.getDistance(point, v.point))
                        })
                        data.sort(function(a, b) {
                            if (a.distance < b.distance) {
                                return -1;
                            }
                            if (a.distance == b.distance) {
                                return 0;
                            }
                            if (a.distance > b.distance) {
                                return 1
                            }
                        })
                        callback(data);
                    }, 10, 5000)
                }

                function filterData(arrayBefore, arrayAfter,distance) {
                    for (i in arrayBefore) {
                        if (arrayBefore[i].distance < distance) {
                            arrayAfter.push(arrayBefore[i])
                        }
                    }
                    return arrayAfter;
                }

                function getTraffic(callback) {
                    type = 'traffic';
                    var bus, sub;
                    var data = {
                        busData: null,
                        subData: null
                    }

                    function handlerTraffic(data) {
                        var ret = [],
                            busArray = [],
                            subArray = [];
                        filterData(data.busData, busArray,1000);
                        filterData(data.subData, subArray,1000);
                        var num = busArray.length + subArray.length;
                        if (subArray.length > 5) {
                            var sub = subArray.length > 5 ? 5 : subArray;
                            sub = subArray.slice(0, sub);
                            bus = busArray.slice(0, 5 - sub)
                        } else {
                            sub = subArray;
                            bus = busArray.slice(0, 10 - subArray.length);
                        }
                        ret = callback(sub, bus);
                    }

                    function handlerSub(ret) {
                        data.subData = ret;
                        if (data.subData && data.busData) {
                            CACHE[type].data = data;
                            handlerTraffic(data);
                        }
                    }

                    function handlerBus(ret) {
                        data.busData = ret;
                        if (data.subData && data.busData) {
                            CACHE[type].data = data;
                            handlerTraffic(data)
                        }
                    }

                    getDataCommon('地铁', handlerSub);
                    getDataCommon('公交', handlerBus);
                }

                function getSchool(callback) {
                    var type = "school";
                    var schoolArray=[];
                    CACHE[type].data && callback(CACHE[type].data);
                    getDataCommon('学校', function(data) {
                        filterData(data, schoolArray,1000);
                        CACHE[type].data = schoolArray;
                        callback(schoolArray);
                    })
                }

                function getHospital(callback) {
                    var type = 'hospital';
                    var hospitalArray=[];
                    CACHE[type].data && callback(CACHE[type]);
                    getDataHospital('医院', function(data) {
                        filterData(data, hospitalArray,5000);
                        CACHE[type].data = hospitalArray;
                        callback(hospitalArray);
                    })
                }

                function getCommerce(callback) {
                    var type = "commerce"
                    var restaurant, bank, supermarket;
                    var data = {
                        restaurantData: null,
                        bankData: null,
                        supermarketData: null
                    }

                    function handlerCommerce(data) {
                        var restaurantArray = [],
                            bankArray = [],
                            supermarketArray = [];
                        filterData(data.restaurantData, restaurantArray,1000);
                        filterData(data.bankData, bankArray,1000);
                        filterData(data.supermarketData, supermarketArray,1000);
                        var ret = [];
                        var num = restaurantArray.length + bankArray.length + supermarketArray.length;
                        if (num > 10) {
                            var res = restaurantArray.length > 6 ? 6 : restaurantArray.length;
                            var ban = bankArray.length > 2 ? 2 : bankArray.length;
                            restaurant = restaurantArray.slice(0, res);
                            bank = bankArray.slice(0, ban);
                            supermarket = supermarketArray.slice(0, 10 - res - ban);
                        } else {
                            restaurant = restaurantArray;
                            bank = bankArray;
                            supermarket = supermarketArray;
                        }
                        ret = callback(restaurant, bank, supermarket);
                    }

                    function commonCommerce() {
                        if (data.restaurantData && data.bankData && data.supermarketData) {
                            CACHE[type].data = data;
                            handlerCommerce(data)
                        }
                    }

                    function handlerRestaurant(ret) {
                        data.restaurantData = ret;
                        commonCommerce();
                    }

                    function handlerBank(ret) {
                        data.bankData = ret;
                        commonCommerce();
                    }

                    function handlerSupermarket(ret) {
                        data.supermarketData = ret;
                        commonCommerce();
                    }
                    getDataCommon('餐馆', handlerRestaurant);
                    getDataCommon('银行', handlerBank);
                    getDataCommon('超市', handlerSupermarket)
                }
                var handlers = {
                    getTraffic: getTraffic,
                    getSchool: getSchool,
                    getHospital: getHospital,
                    getCommerce: getCommerce
                }
                return handlers;
            }
            return {
                View: VIEW,
                Event: EVENT,
                Data: DATA
            }
        }
        return {
            map: map
        }
    }
    return {
        AreaBlock: AreaBlock
    }
})();