(function ($) {
 "use strict";
    
/*-----------------------------
	Menu Stick
---------------------------------*/
    if ($(".sticker")[0]){
        $('.sticker');
        $(window).scroll(function(){
            var wind_scr = $(window).scrollTop();
            var window_width = $(window).width();
            var head_w = $('.sticker').height();
            if (window_width >= 10) {
                if(wind_scr < 400){
                    if($('.sticker').data('stick') === true){
                        $('.sticker').data('stick', false);
                        $('.sticker').stop(true).animate({opacity : 0}, 300, function(){
                            $('.sticker').removeClass('stick slideDown');
                            $('.sticker').stop(true).animate({opacity : 1}, 300);
                        });
                    }
                } else {
                    if($('.sticker').data('stick') === false || typeof $('.sticker').data('stick') === 'undefined'){
                        $('.sticker').data('stick', true);
                        $('.sticker').stop(true).animate({opacity : 0},300,function(){
                            $('.sticker').addClass('stick slideDown');
                            $('.sticker.stick').stop(true).animate({opacity : 1}, 300);
                        });
                    }
                }
            }
        });
    };	
    
/*----------------------------
    jQuery MeanMenu
------------------------------ */
    $('.mobile-menu nav').meanmenu({
        meanScreenWidth: "990",
        meanMenuContainer: ".mobile-menu",
        onePage: true,
    });
	
/*----------------------------
    Wow js active
------------------------------ */
    new WOW().init();
 
/*--------------------------
    ScrollUp
---------------------------- */	
	$.scrollUp({
        scrollText: '<i class="zmdi zmdi-chevron-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    }); 
    
    
/*--------------------------------
	Testimonial Slick Carousel
-----------------------------------*/
    $('.testimonial-text-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        draggable: false,
        fade: true,
        asNavFor: '.slider-nav'
    });
/*------------------------------------
	Testimonial Slick Carousel as Nav
--------------------------------------*/
    $('.testimonial-image-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.testimonial-text-slider',
        dots: false,
        arrows: true,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: '10px',
        responsive: [
            {
              breakpoint: 500,
              settings: {
                dots: false,
                slidesToShow: 3,  
                centerPadding: '0px',
                }
            },
            {
              breakpoint: 480,
              settings: {
                autoplay: true,
                dots: false,
                slidesToShow: 1,
                centerMode: false,
                }
            }
        ]
    });
    
/*--------------------------------
	One Page Nav
-----------------------------------*/
    var top_offset = $('.main-menu').height() - -60;
    $('.main-menu nav ul').onePageNav({
        currentClass: 'active',
        scrollOffset: top_offset,
    });
 
})(jQuery); 

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Configurações
        this.settings = {
            damping: 0.05,    // Quão suave (0.01 - 0.1)
            speed: 2,         // Velocidade do scroll
            touchDamping: 0.1 // Suavidade em dispositivos touch
        };

        this.currentScroll = 0;
        this.targetScroll = 0;
        this.isScrolling = false;
        
        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        // Previne o scroll padrão
        document.addEventListener('scroll', (e) => {
            e.preventDefault();
        }, { passive: false });

        // Detecta a intenção de scroll
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        window.addEventListener('touchmove', this.handleTouch.bind(this), { passive: false });
        window.addEventListener('keydown', this.handleKeys.bind(this));

        // Links âncora
        document.addEventListener('click', this.handleAnchorClick.bind(this));

        // Resize e load
        window.addEventListener('resize', this.updateScroll.bind(this));
        window.addEventListener('load', this.updateScroll.bind(this));
    }

    handleWheel(e) {
        e.preventDefault();
        
        const delta = e.deltaY || e.detail || (-e.wheelDelta);
        this.targetScroll += delta * this.settings.speed;
        
        this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.getMaxScroll()));
        
        if (!this.isScrolling) {
            this.isScrolling = true;
        }
    }

    handleTouch(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            
            if (this.lastTouchY) {
                const delta = this.lastTouchY - touch.clientY;
                this.targetScroll += delta * this.settings.speed * 2;
                
                this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.getMaxScroll()));
                
                if (!this.isScrolling) {
                    this.isScrolling = true;
                }
            }
            
            this.lastTouchY = touch.clientY;
        }
    }

    handleKeys(e) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            this.targetScroll += window.innerHeight * 0.8;
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            this.targetScroll -= window.innerHeight * 0.8;
        } else if (e.key === 'Home') {
            e.preventDefault();
            this.targetScroll = 0;
        } else if (e.key === 'End') {
            e.preventDefault();
            this.targetScroll = this.getMaxScroll();
        }
        
        this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.getMaxScroll()));
        this.isScrolling = true;
    }

    handleAnchorClick(e) {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.offsetTop;
                this.scrollTo(targetPosition, 1000);
            }
        }
    }

    scrollTo(position, duration = 1000) {
        const start = this.currentScroll;
        const change = position - start;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeInOutCubic)
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            this.targetScroll = start + change * ease;
            this.isScrolling = true;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    animate() {
        const damping = this.isTouchDevice() ? this.settings.touchDamping : this.settings.damping;
        
        // Aplica suavização
        this.currentScroll += (this.targetScroll - this.currentScroll) * damping;
        
        // Aplica o scroll
        window.scrollTo(0, this.currentScroll);
        
        // Verifica se parou de scrollar
        if (Math.abs(this.targetScroll - this.currentScroll) < 0.1) {
            this.currentScroll = this.targetScroll;
            this.isScrolling = false;
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    updateScroll() {
        this.targetScroll = window.scrollY;
        this.currentScroll = window.scrollY;
    }

    getMaxScroll() {
        return document.documentElement.scrollHeight - window.innerHeight;
    }

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    new SmoothScroll();
});