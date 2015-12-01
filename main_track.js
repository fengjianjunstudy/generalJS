
/*
@file �ƹ�λ����
@author ���� <caoyu#at#csdn.net>
@version 20130902
 */
(function(definition, undef) {
  var $, exports, global, i;
  global = this;
  $ = global.jQuery;
  exports = {};
  definition(global, exports, $);
  if (global.csdn === undef) {
    global.csdn = exports;
  }
  for (i in exports) {
    global[i] = global.csdn[i] = exports[i];
  }
})(function(global, exports, $, undef) {
  var ads, crossdomainGet, domReadyListener, done, findAllAds, linksContent, protocol, ref, s, trackingAd, viewedHeight;
  protocol = global.location.protocol.substr(0, 4) === 'http' ? '' : 'http:';
  ref = global.document.referrer || '-';
  ads = [];
  viewedHeight = 0;
  domReadyListener = function() {
    var ad, groups, j, k, len, n, ref1, ref2, v, w;
    n = 0;
    w = $(global).scroll(function() {
      if (!ads[0]) {
        return;
      }
      global.clearTimeout(n);
      return n = global.setTimeout(function() {
        var ad, j, len, top;
        top = w.scrollTop() + w.height();
        if (top > viewedHeight) {
          viewedHeight = top;
          for (j = 0, len = ads.length; j < len; j++) {
            ad = ads[j];
            if (!(!ad.viewed && top >= ad.top)) {
              continue;
            }
            ad.viewed = true;
            crossdomainGet(ad.data());
          }
        }
      }, 100);
    });
    groups = {};
    ref1 = $('.tracking-ad');
    for (j = 0, len = ref1.length; j < len; j++) {
      ad = ref1[j];
      k = $(ad).attr('data-mod');
      ((ref2 = groups[k]) != null ? ref2.push(ad) : void 0) || (groups[k] = [ad]);
    }
    for (k in groups) {
      v = groups[k];
      trackingAd($(v));
    }
    return w.triggerHandler('scroll');
  };

  /*
   ###
  ����ָ�����ƹ�λ�������ع�͵��
  @param {CSS Selector/jQuery Object/DOMElement/DOMElement[]} ele �����ƹ����ӵ��ƹ�λ������ǩ
  @param {Object} opts ѡ�����
  @param {String} opts.pid ��Ʒ�߱�ʶ����ѡ��Ĭ��ȡ��ǰҳ������foo.csdn.net�е�foo�����ᴦ���������������
  @param {String} opts.mod ģ��id������
  @param {String} opts.mtp ģ�����ͣ���ѡ��Ĭ�ϻ�̽���Ƿ��д����ӵ�ͼƬ�����������3ͼƬ������2����
  @param {String/RegExp} opts.trim ��������������һ���ü������򣬿�ѡ��ʼ�ջ��Ȳü������ߵĿհ��ַ�
  @param {CSS Selector} filter ��ѡ���Ը��ٵ��ƹ����ӽ�һ�����ˣ����ｫ������Щclass="foo"���ǲ�����class="foo bar"������
  ###
   */
  trackingAd = exports.trackingAd = function(ele, opts) {
    var filter, mod, mtp, pid, ref1, trim;
    if (opts == null) {
      opts = {};
    }
    if (typeof ele === 'string' || !ele instanceof $) {
      ele = $(ele);
    }
    pid = opts.pid || ele.attr('data-pid') || global.document.body.getAttribute('data-pid') || ((ref1 = /(\w+)\.\w+\.\w+$/.exec(global.location.host)) != null ? ref1[1] : void 0);
    mod = opts.mod || ele.attr('data-mod');
    mtp = opts.mtp || ele.attr('data-mtp') || ($('a img', ele)[0] ? 3 : 2);
    trim = opts.trim || ele.attr('data-trim');
    if (typeof trim === 'string' && trim.charAt(0) === '/') {
      trim = trim.split('/');
      trim = new RegExp(trim.slice(1, -1), trim.slice(-1));
    }
    filter = opts.filter || ele.attr('data-filter') || '';
    return findAllAds(ele, filter, function(links) {
      var ad, con;
      con = linksContent(mtp, trim, links);
      ad = {
        top: ele.offset().top,
        ele: ele,
        viewed: false,
        data: function() {
          var ref2;
          return {
            uid: ((ref2 = /(; )?(UserName|_javaeye_cookie_id_)=([^;]+)/.exec(global.document.cookie)) != null ? ref2[3] : void 0) || '-',
            ref: ref,
            pid: pid,
            mod: mod,
            mtp: mtp,
            con: con,
            ck: '-'
          };
        }
      };
      ads.push(ad);
      if (viewedHeight > ad.top) {
        $(global).triggerHandler('scroll');
      }
      links.each(function() {
        if (this.target === '') {
          return this.target = '_blank';
        }
      });
      return links.click(function() {
        var d;
        if (this.href && this.innerHTML.replace(/^\s+|\s+$/g, '')) {
          d = ad.data();
          d.ck = linksContent(mtp, trim, $(this));
          crossdomainGet(d);
        }
      });
    });
  };
  findAllAds = function(cont, filter, callback) {
    var count, iframes, links;
    links = $('a' + filter, cont);
    iframes = $('iframe', cont);
    if (iframes[0]) {
      count = iframes.length;
      return iframes.each(function() {
        var ifr, listener;
        ifr = $(this);
        listener = function() {
          if (ifr === null) {
            return;
          }
          links = links.add(ifr.contents().find('a' + filter));
          ifr = null;
          count--;
          if (count === 0) {
            return callback(links);
          }
        };
        return ifr.load(listener);
      });
    } else {
      return callback(links);
    }
  };
  linksContent = function(mtp, trim, ele) {
    return ele.map(function() {
      var img, text;
      if (mtp === 3) {
        img = $('img', this)[0];
        if (img) {
          text = img.title || img.alt || img.src;
        }
      }
      if (!text) {
        text = this.innerHTML.replace(/<[^>]+>/g, '').replace(/^\s+|\s+$/g, '') || this.title || this.alt || this.innerHTML.replace(/^\s+|\s+$/g, '');
      }
      if (trim) {
        text = (text + '').replace(trim, '');
      }
      return text + ',' + this.href;
    }).get().join(';');
  };
  crossdomainGet = function(data) {
    var i;
    if (!data.con) {
      return;
    }
    data[Math.random() * 10000 | 0] = '';
    data['x-acl-token'] = 'status_js_dkuyqthzbajmncbsb_token';
    i = new Image();
    i.onload = i.onerror = function() {
      i.onload = i.onerror = null;
      i.removeAttribute('src');
      return i = null;
    };
    return i.src = protocol + '//dc.csdn.net/re?' + $.param(data);
  };
  if ($ === undef) {
    done = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.charset = 'utf-8';
    s.src = 'http://www.csdn.net/js/jquery-1.4.2.min.js';
    s.onload = s.onreadystatechange = function() {
      if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
        done = true;
        global.jQuery.noConflict();
        $ = global.jQuery;
        $(domReadyListener);
        return s.onload = s.onreadystatechange = null;
      }
    };
    document.getElementsByTagName('head')[0].insertBefore(s, null);
  } else {
    $(domReadyListener);
  }
});
