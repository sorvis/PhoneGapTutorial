var app = {
	
	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},
	
	route: function() {
		var self = this;
		var hash = window.location.hash;
		if (!hash) {
			if (this.homePage) {
				this.slidePage(this.homePage);
			} else {
				this.homePage = new HomeView(this.store).render();
				this.slidePage(this.homePage);
				this.homePage.findByName();
			}
			return;
		}
		var match = hash.match(this.detailsURL);
		if (match) {
			this.store.findById(Number(match[1]), function(employee) {
				self.slidePage(new EmployeeView(employee).render());
			});
		}
	},
	
	slidePage: function(page) {
		//navigator.notification.vibrate(500);
		if(!typeof navigator.notification === 'undefined')
		{
			navigator.notification.vibrate( 1000 );
		}
	 
		var currentPageDest,
			self = this;
			
		// Cleaning up: remove old pages that were moved out of the viewport
		$('.stage-right, .stage-left').not('.homePage').remove();
	 
		// If there is no current page (app just started) -> No transition: Position new page in the view port
		if (!this.currentPage) {
			$(page.el).attr('class', 'page stage-center');
			$('body').append(page.el);
			this.currentPage = page;
			return;
		}
	 
		if (page === app.homePage) {
			// Always apply a Back transition (slide from left) when we go back to the search page
			$(page.el).attr('class', 'page stage-left');
			currentPageDest = "stage-right";
		} else {
			// Forward transition (slide from right)
			$(page.el).attr('class', 'page stage-right');
			currentPageDest = "stage-left";
		}
	 
		$('body').append(page.el);
	 
		// Wait until the new page has been added to the DOM...
		setTimeout(function() {
			// Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
			$(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
			// Slide in the new page
			$(page.el).attr('class', 'page stage-center transition');
			self.currentPage = page;
		});
	 
	},
	
	registerEvents: function() {
		var self = this;
		// Check of browser supports touch events...
		if (document.documentElement.hasOwnProperty('ontouchstart')) {
			// ... if yes: register touch event listener to change the "selected" state of the item
			$('body').on('touchstart', 'a', function(event) {
				$(event.target).addClass('tappable-active');
			});
			$('body').on('touchend', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});
		} else {
			// ... if not: register mouse events instead
			$('body').on('mousedown', 'a', function(event) {
				$(event.target).addClass('tappable-active');
			});
			$('body').on('mouseup', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});
		}
		
		document.addEventListener('deviceready', this.onDeviceReady, false);
		
		$(window).on('hashchange', $.proxy(this.route, this));
	},

	initialize: function() {
		var self = this;
		self.registerEvents();
		this.detailsURL = /^#employees\/(\d{1,})/;
		this.store = new MemoryStore(function() {
			self.route();
		})},
		
		
		// deviceready Event Handler
		//
		// The scope of 'this' is the event. In order to call the 'receivedEvent'
		// function, we must explicity call 'app.receivedEvent(...);'
		onDeviceReady: function() {
			app.receivedEvent('deviceready');
		},
		// Update DOM on a Received Event
		receivedEvent: function(id) {
			var parentElement = document.getElementById(id);
			var listeningElement = parentElement.querySelector('.listening');
			var receivedElement = parentElement.querySelector('.received');

			listeningElement.setAttribute('style', 'display:none;');
			receivedElement.setAttribute('style', 'display:block;');

			console.log('Received Event: ' + id);
		},

		vibrate: function() {
		  navigator.notification.vibrate( 1000 );
		}
};

app.initialize();
