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
            touchDamping: 0.08 // Suavidade em dispositivos touch
        };

        this.currentScroll = 0;
        this.targetScroll = 0;
        this.isScrolling = false;
        this.isTouchDevice = this.detectTouchDevice();
        this.lastTouchTime = 0;
        this.touchStartY = 0;
        this.touchStartScroll = 0;
        this.isDragging = false;
        this.velocity = 0;
        this.lastTime = 0;
        
        this.bindEvents();
        this.animate();
    }

    detectTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    bindEvents() {
        // Detecta a intenção de scroll
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Eventos de touch melhorados
        window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        window.addEventListener('keydown', this.handleKeys.bind(this));

        // Links âncora
        document.addEventListener('click', this.handleAnchorClick.bind(this));

        // Resize e load
        window.addEventListener('resize', this.updateScroll.bind(this));
        window.addEventListener('load', this.updateScroll.bind(this));
        
        // Impede o scroll padrão apenas se não for touch device
        if (!this.isTouchDevice) {
            document.addEventListener('scroll', (e) => {
                e.preventDefault();
            }, { passive: false });
        }
    }

    handleWheel(e) {
        if (this.isTouchDevice) return; // Não aplica wheel em dispositivos touch
        
        e.preventDefault();
        
        const delta = e.deltaY || e.detail || (-e.wheelDelta);
        this.targetScroll += delta * this.settings.speed;
        
        this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.getMaxScroll()));
        
        if (!this.isScrolling) {
            this.isScrolling = true;
        }
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.touchStartY = e.touches[0].clientY;
            this.touchStartScroll = this.currentScroll;
            this.isDragging = true;
            this.velocity = 0;
            this.lastTime = Date.now();
            this.lastTouchY = this.touchStartY;
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 1 && this.isDragging) {
            e.preventDefault();
            
            const touchY = e.touches[0].clientY;
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastTime;
            
            if (deltaTime > 0) {
                const deltaY = this.lastTouchY - touchY;
                this.velocity = deltaY / deltaTime;
                
                // Aplica scroll diretamente durante o drag para melhor responsividade
                this.targetScroll = this.touchStartScroll + (this.touchStartY - touchY) * 1.5;
                this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.getMaxScroll()));
                
                // Atualiza posição atual imediatamente para feedback visual
                this.currentScroll = this.targetScroll;
                window.scrollTo(0, this.currentScroll);
                
                this.lastTouchY = touchY;
                this.lastTime = currentTime;
            }
            
            this.isScrolling = true;
        }
    }

    handleTouchEnd(e) {
        if (this.isDragging) {
            this.isDragging = false;
            
            // Aplica momentum/inércia baseado na velocidade
            if (Math.abs(this.velocity) > 0.1) {
                const momentum = this.velocity * 800; // Ajuste da força do momentum
                this.targetScroll += momentum;
                this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.getMaxScroll()));
                this.isScrolling = true;
            }
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
        if (this.isTouchDevice && this.isDragging) {
            // Durante o drag, não aplica damping para manter responsividade
            requestAnimationFrame(this.animate.bind(this));
            return;
        }
        
        const damping = this.isTouchDevice ? this.settings.touchDamping : this.settings.damping;
        
        // Aplica suavização
        const diff = this.targetScroll - this.currentScroll;
        this.currentScroll += diff * damping;
        
        // Aplica o scroll
        if (Math.abs(diff) > 0.1) {
            window.scrollTo(0, this.currentScroll);
        }
        
        // Verifica se parou de scrollar
        if (Math.abs(this.targetScroll - this.currentScroll) < 0.5) {
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
}

// Inicialização condicional - só ativa em desktop
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Ativa apenas em desktop para evitar problemas no mobile
    if (!isMobile) {
        new SmoothScroll();
    } else {
        // Para mobile, opcionalmente você pode adicionar um smooth scroll mais leve
        // ou deixar o scroll nativo
        console.log('SmoothScroll desativado em dispositivos móveis');
    }
});