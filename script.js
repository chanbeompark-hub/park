// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 모바일 메뉴 토글
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // 메뉴 항목 클릭 시 모바일 메뉴 닫기
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // 스크롤 시 헤더 스타일 변경
    const header = document.querySelector('.header');
    
    function updateHeaderOnScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeaderOnScroll);
    
    // 스무스 스크롤
    const navLinksAll = document.querySelectorAll('a[href^="#"]');
    
    navLinksAll.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .pricing-card');
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // 숫자 카운터 애니메이션
    function animateCounter(element, target, duration = 2000) {
        let current = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current);
            }
            
            // % 표시가 있는 경우
            if (element.textContent.includes('%') || element.parentElement.textContent.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            }
            
            // + 표시가 있는 경우
            if (element.nextElementSibling && element.nextElementSibling.textContent === '+') {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }
    
    // 통계 섹션 애니메이션
    const statNumbers = document.querySelectorAll('.stat h3');
    const heroSection = document.querySelector('.hero');
    
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    stat.textContent = '0';
                    animateCounter(stat, number);
                });
                statObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    if (heroSection) {
        statObserver.observe(heroSection);
    }
    
    // 폼 유효성 검사 및 제출
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 기본 유효성 검사
            if (!validateForm(data)) {
                return;
            }
            
            // 로딩 상태 표시
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.classList.add('loading');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
            submitButton.disabled = true;
            
            // 실제 환경에서는 서버로 데이터 전송
            // 여기서는 시뮬레이션
            setTimeout(() => {
                showNotification('상담 신청이 완료되었습니다! 24시간 내에 연락드리겠습니다.', 'success');
                contactForm.reset();
                
                // 버튼 원래 상태로 복구
                submitButton.classList.remove('loading');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    // 폼 유효성 검사 함수
    function validateForm(data) {
        const required = ['name', 'phone', 'email', 'business-type'];
        let isValid = true;
        
        // 필수 필드 확인
        required.forEach(field => {
            const element = document.getElementById(field);
            const value = data[field];
            
            if (!value || value.trim() === '') {
                showFieldError(element, '이 필드는 필수입니다.');
                isValid = false;
            } else {
                clearFieldError(element);
            }
        });
        
        // 이메일 형식 검사
        const email = data.email;
        if (email && !isValidEmail(email)) {
            showFieldError(document.getElementById('email'), '올바른 이메일 형식을 입력해주세요.');
            isValid = false;
        }
        
        // 전화번호 형식 검사
        const phone = data.phone;
        if (phone && !isValidPhone(phone)) {
            showFieldError(document.getElementById('phone'), '올바른 전화번호 형식을 입력해주세요.');
            isValid = false;
        }
        
        // 개인정보 동의 확인
        if (!data.privacy) {
            showNotification('개인정보 수집 및 이용에 동의해주세요.', 'error');
            isValid = false;
        }
        
        return isValid;
    }
    
    // 이메일 형식 검사
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 전화번호 형식 검사
    function isValidPhone(phone) {
        const phoneRegex = /^[0-9-+\s()]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    // 필드 에러 표시
    function showFieldError(element, message) {
        clearFieldError(element);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '0.5rem';
        
        element.parentNode.appendChild(errorDiv);
        element.style.borderColor = '#e74c3c';
    }
    
    // 필드 에러 제거
    function clearFieldError(element) {
        const errorDiv = element.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        element.style.borderColor = '#e9ecef';
    }
    
    // 알림 표시 함수
    function showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // 스타일 적용
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
            margin-left: auto;
        `;
        
        document.body.appendChild(notification);
        
        // 애니메이션으로 표시
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 닫기 버튼 이벤트
        notification.querySelector('.notification-close').addEventListener('click', () => {
            hideNotification(notification);
        });
        
        // 5초 후 자동 제거
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
    }
    
    // 알림 숨기기
    function hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
    
    // 가격 호버 효과
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // 포트폴리오 이미지 지연 로딩
    const portfolioImages = document.querySelectorAll('.portfolio-image img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    portfolioImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // 페이지 로드 완료 후 애니메이션 시작
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // 히어로 섹션 애니메이션
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroText) {
            heroText.style.animation = 'fadeInUp 1s ease forwards';
        }
        
        if (heroImage) {
            heroImage.style.animation = 'fadeInRight 1s ease 0.3s forwards';
        }
    });
});

// CSS 애니메이션 키프레임 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* 모바일 메뉴 스타일 */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            z-index: 999;
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
    
    /* 헤더 스크롤 효과 */
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    }
    
    /* 초기 상태 숨김 */
    .hero-text,
    .hero-image {
        opacity: 0;
    }
    
    body.loaded .hero-text,
    body.loaded .hero-image {
        opacity: 1;
    }
`;

document.head.appendChild(style);