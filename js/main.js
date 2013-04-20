$(function() {
  $('.needTooltip').tooltip({
    placement : "bottom"
  });

  var service_names = initLifestream();

  $('#filter').typeahead({
    source : service_names
  });

  initFilter(service_names);
});

function initLifestream() {
    var count = 0,
      list = [{
        service: 'stackoverflow',
        user: '1097599'
      }, {
        service: 'twitter',
        user: 'arnaudgourlay'
      }, {
        service: 'github',
        user: 'agourlay'
      }, {
        service: 'lastfm',
        user: 'shagaan'
      }];

    var service_names = _.pluck(list, 'service');

    Date.prototype.toISO8601 = function(date) {
      var pad = function(amount, width) {
          var padding = "";
          while(padding.length < width - 1 && amount < Math.pow(10, width - padding.length - 1))
          padding += "0";
          return padding + amount.toString();
        };
      date = date ? date : new Date();
      var offset = date.getTimezoneOffset();
      return pad(date.getFullYear(), 4) + "-" + pad(date.getMonth() + 1, 2) + "-" + pad(date.getDate(), 2) + "T" + pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2) + ":" + pad(date.getUTCSeconds(), 2) + (offset > 0 ? "-" : "+") + pad(Math.floor(Math.abs(offset) / 60), 2) + ":" + pad(Math.abs(offset) % 60, 2);
    };

    $("#lifestream").lifestream({
      limit: 20,
      list: list,
      feedloaded: function() {
        count++;
        // Check if all the feeds have been loaded
        if(count === list.length) {
          $("#lifestream li").each(function() {
            var element = $(this),
              date = new Date(element.data("time"));
            element.append(' <abbr class="timeago" title="' + date.toISO8601(date) + '">' + date + "</abbr>");
          });
          $("#lifestream .timeago").timeago();
        }
      }
    });
    return service_names;
}

function initFilter(service_names) {

  $("#filter").on("keyup", function(ev) {
    var $filter = $(this),
      keyCode = ev.keyCode || ev.which,
      search;

    if(keyCode === 27) { //ESC
      $filter.val("");
    }

    search = $(this).val();
    $("#lifestream").find("li").each(function() {
      var $li = $(this);
      if(search === "") {
        $li.show();
      } else {
        if(_.contains(service_names, search)) {
          $li.toggle($li.hasClass("lifestream-" + search));
        } else {
          if($li.text().search(search) > 0) {
            $li.show();
          } else {
            $li.hide();
          }
        }
      }
    });
  });
}
