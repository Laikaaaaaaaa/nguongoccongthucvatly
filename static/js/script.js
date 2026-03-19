/*
=====================================================
  JAVASCRIPT CHÍNH - Nguồn gốc Công thức Vật Lí 12
  Tác giả: Nhóm Vo-Viet-Anh
  Mô tả: Xử lý tương tác người dùng
=====================================================
*/

// ========== TOGGLE MENU MOBILE ==========
// Khi bấm nút hamburger thì show/hide menu
document.addEventListener('DOMContentLoaded', function() {
    var btnToggle = document.getElementById('btn-toggle-menu');
    var menuChinh = document.getElementById('menu-chinh');

    if (btnToggle && menuChinh) {
        btnToggle.addEventListener('click', function() {
            menuChinh.classList.toggle('show');
        });

        // Đóng menu khi click vào link (trên mobile)
        var cacLink = menuChinh.querySelectorAll('.nav-link');
        cacLink.forEach(function(link) {
            link.addEventListener('click', function() {
                menuChinh.classList.remove('show');
            });
        });
    }

    // Gắn sự kiện cho các nút tạo video ở trang nội dung
    var dsNutTaoVideoNhanh = document.querySelectorAll('.js-tao-video-nhanh');
    dsNutTaoVideoNhanh.forEach(function(nut) {
        nut.addEventListener('click', function() {
            var idCT = parseInt(nut.dataset.id, 10);
            var tenCT = nut.dataset.ten || '';
            taoVideoNhanh(idCT, tenCT);
        });
    });

    // Gắn sự kiện cho nút tạo video ở trang chi tiết
    var nutTaoVideoChiTiet = document.querySelector('.js-tao-video-chi-tiet');
    if (nutTaoVideoChiTiet) {
        nutTaoVideoChiTiet.addEventListener('click', function() {
            var idCT = parseInt(nutTaoVideoChiTiet.dataset.id, 10);
            var tenCT = nutTaoVideoChiTiet.dataset.ten || '';
            taoVideoTuChiTiet(idCT, tenCT);
        });
    }

    // Hiệu ứng reveal khi kéo trang
    khoiTaoHieuUngReveal();

    // Tạo hiệu ứng hạt sáng cho hero
    taoHatSangHero();

    // Hiệu ứng nghiêng thẻ khi rê chuột
    khoiTaoHieuUngTiltCard();
});


// ========== TÌM KIẾM CÔNG THỨC ==========
// Hàm tìm kiếm realtime trên trang nội dung
function timKiemCongThuc() {
    var tuKhoa = document.getElementById('input-tim-kiem').value.toLowerCase().trim();
    var danhSach = document.querySelectorAll('.ct-detail-card');
    var ketQuaText = document.getElementById('ket-qua-tim');
    var boxKhongTimThay = document.getElementById('khong-tim-thay');

    var soKetQua = 0;

    // Duyệt qua từng card và ẩn/hiện
    danhSach.forEach(function(card) {
        var tenCT = card.getAttribute('data-ten').toLowerCase();
        var nhKH = card.getAttribute('data-nkh').toLowerCase();

        // So khớp tên công thức hoặc nhà khoa học
        if (tenCT.includes(tuKhoa) || nhKH.includes(tuKhoa)) {
            card.style.display = 'flex';
            soKetQua++;
        } else {
            card.style.display = 'none';
        }
    });

    // Cập nhật text kết quả
    if (ketQuaText) {
        if (tuKhoa === '') {
            ketQuaText.textContent = 'Hiển thị ' + danhSach.length + ' công thức';
        } else {
            ketQuaText.textContent = 'Tìm thấy ' + soKetQua + ' kết quả cho "' + tuKhoa + '"';
        }
    }

    // Hiện thông báo không tìm thấy
    if (boxKhongTimThay) {
        if (soKetQua === 0 && tuKhoa !== '') {
            boxKhongTimThay.style.display = 'block';
        } else {
            boxKhongTimThay.style.display = 'none';
        }
    }
}


// ========== TẠO VIDEO AI (TRANG CHỦ) ==========
// Hàm xử lý khi bấm nút "Tạo video AI" ở trang chủ
function taoVideoAI() {
    var selectCT = document.getElementById('chon-cong-thuc');
    var ketQuaBox = document.getElementById('ai-ket-qua');

    // Kiểm tra đã chọn công thức chưa
    if (!selectCT || !selectCT.value) {
        alert('Vui lòng chọn một công thức trước khi tạo video!');
        return;
    }

    var idCT = parseInt(selectCT.value);

    // Hiện loading
    ketQuaBox.style.display = 'block';
    ketQuaBox.innerHTML = taoHTMLLoading();

    // Giả lập loading với phần trăm
    giaLapLoading(ketQuaBox, function() {
        // Gọi API backend
        goiAPItaoVideo(idCT, function(duLieu) {
            ketQuaBox.innerHTML = taoHTMLThanhCong(duLieu);
        }, function(loi) {
            ketQuaBox.innerHTML = taoHTMLLoi(loi);
        });
    });
}


// ========== TẠO VIDEO NHANH (TRANG NỘI DUNG) ==========
// Bấm nút "Tạo Video AI" trên mỗi card ở trang nội dung
function taoVideoNhanh(idCT, tenCT) {
    var popup = document.getElementById('popup-video-ai');
    var noiDungPopup = document.getElementById('popup-noi-dung');

    if (!popup || !noiDungPopup) return;

    // Hiện popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Không cho scroll

    // Hiện loading trong popup
    noiDungPopup.innerHTML = '<h3 style="margin-bottom: 20px;"><i class="fa-solid fa-robot"></i> Đang tạo video cho: ' + tenCT + '</h3>' + taoHTMLLoading();

    // Giả lập loading
    giaLapLoading(noiDungPopup, function() {
        goiAPItaoVideo(idCT, function(duLieu) {
            noiDungPopup.innerHTML = '<h3 style="margin-bottom: 16px;"><i class="fa-solid fa-clapperboard"></i> AI Video: ' + tenCT + '</h3>' + taoHTMLThanhCong(duLieu);
        }, function(loi) {
            noiDungPopup.innerHTML = '<h3 style="margin-bottom: 16px;"><i class="fa-solid fa-clapperboard"></i> AI Video</h3>' + taoHTMLLoi(loi);
        });
    });
}


// ========== TẠO VIDEO TỪ TRANG CHI TIẾT ==========
// Bấm nút ở sidebar trang chi tiết
function taoVideoTuChiTiet(idCT, tenCT) {
    var popup = document.getElementById('popup-video-ai');
    var noiDungPopup = document.getElementById('popup-noi-dung');
    var sidebarResult = document.getElementById('ai-result-sidebar');

    // Nếu có popup thì dùng popup
    if (popup && noiDungPopup) {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        noiDungPopup.innerHTML = '<h3 style="margin-bottom: 20px;"><i class="fa-solid fa-robot"></i> Đang tạo video cho: ' + tenCT + '</h3>' + taoHTMLLoading();

        giaLapLoading(noiDungPopup, function() {
            goiAPItaoVideo(idCT, function(duLieu) {
                noiDungPopup.innerHTML = '<h3 style="margin-bottom: 16px;"><i class="fa-solid fa-clapperboard"></i> AI Video: ' + tenCT + '</h3>' + taoHTMLThanhCong(duLieu);

                // Cũng cập nhật sidebar
                if (sidebarResult) {
                    sidebarResult.style.display = 'block';
                    sidebarResult.innerHTML = '<i class="fa-solid fa-circle-check"></i> Đã tạo video thành công!';
                }
            }, function(loi) {
                noiDungPopup.innerHTML = '<h3 style="margin-bottom: 16px;"><i class="fa-solid fa-clapperboard"></i> AI Video</h3>' + taoHTMLLoi(loi);
            });
        });
    }
}


// ========== ĐÓNG POPUP ==========
function dongPopup() {
    var popup = document.getElementById('popup-video-ai');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto'; // Cho scroll lại
    }
}

// Đóng popup khi click bên ngoài
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('popup-overlay')) {
        dongPopup();
    }
});

// Đóng popup khi bấm ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        dongPopup();
    }
});


// ========== CÁC HÀM HỖ TRỢ ==========

// Tạo HTML loading spinner
function taoHTMLLoading() {
    return '<div class="loading-container">' +
           '    <div class="loading-spinner"></div>' +
           '    <p class="loading-text"><i class="fa-solid fa-robot"></i> AI đang xử lý...</p>' +
           '    <p class="loading-percent" id="loading-percent">0%</p>' +
           '    <p style="color: #718096; font-size: 13px; margin-top: 8px;">Đang phân tích nội dung và tạo video minh họa...</p>' +
           '</div>';
}

// Tạo HTML khi thành công
function taoHTMLThanhCong(duLieu) {
    var html = '<div class="ai-thanh-cong">';
    html += '<h3><i class="fa-solid fa-circle-check"></i> ' + duLieu.thong_bao + '</h3>';

    if (duLieu.video_url) {
        html += '<div class="ai-video-wrapper">';
        html += '<iframe src="' + duLieu.video_url + '" ';
        html += 'title="AI Video - ' + duLieu.ten_cong_thuc + '" ';
        html += 'frameborder="0" allowfullscreen></iframe>';
        html += '</div>';
    }

    html += '<p style="margin-top: 16px; color: #718096; font-size: 13px;">';
    html += '<i class="fa-solid fa-bolt"></i> Video được tạo bởi AI dựa trên nội dung lịch sử công thức</p>';
    html += '</div>';
    return html;
}

// Tạo HTML khi lỗi
function taoHTMLLoi(thongBao) {
    return '<div style="text-align: center; padding: 20px;">' +
           '<p style="font-size: 48px; margin-bottom: 12px;"><i class="fa-solid fa-circle-xmark"></i></p>' +
           '<p style="color: #e53e3e; font-weight: 600;">' + thongBao + '</p>' +
           '<p style="color: #718096; font-size: 14px; margin-top: 8px;">Vui lòng thử lại sau!</p>' +
           '</div>';
}

// Giả lập loading với phần trăm chạy từ 0 đến 100
function giaLapLoading(container, callback) {
    var phanTram = 0;
    var loadingEl = container.querySelector('#loading-percent');

    var interval = setInterval(function() {
        // Tăng ngẫu nhiên 2-8% mỗi lần
        phanTram += Math.floor(Math.random() * 7) + 2;

        if (phanTram >= 100) {
            phanTram = 100;
            if (loadingEl) loadingEl.textContent = '100%';
            clearInterval(interval);

            // Chờ chút rồi gọi callback
            setTimeout(function() {
                callback();
            }, 500);
            return;
        }

        if (loadingEl) {
            loadingEl.textContent = phanTram + '%';
        }

        // Thay đổi text loading
        var loadingText = container.querySelector('.loading-text');
        if (loadingText) {
            if (phanTram < 30) {
                loadingText.innerHTML = '<i class="fa-solid fa-robot"></i> AI đang phân tích công thức...';
            } else if (phanTram < 60) {
                loadingText.innerHTML = '<i class="fa-solid fa-book-open"></i> Đang tổng hợp lịch sử...';
            } else if (phanTram < 85) {
                loadingText.innerHTML = '<i class="fa-solid fa-clapperboard"></i> Đang render video...';
            } else {
                loadingText.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Sắp xong rồi!';
            }
        }
    }, 120);
}

// Gọi API backend tạo video
function goiAPItaoVideo(idCongThuc, onSuccess, onError) {
    fetch('/api/tao-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_cong_thuc: idCongThuc })
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Lỗi server');
        }
        return response.json();
    })
    .then(function(duLieu) {
        if (duLieu.trang_thai === 'thanh_cong') {
            onSuccess(duLieu);
        } else {
            onError(duLieu.thong_bao || 'Có lỗi xảy ra!');
        }
    })
    .catch(function(error) {
        console.error('Lỗi khi gọi API:', error);
        onError('Không thể kết nối tới server. Vui lòng thử lại!');
    });
}


// ========== SCROLL EFFECT CHO NAVBAR ==========
// Thêm shadow cho navbar khi scroll xuống
window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
        }
    }
});


// ========== REVEAL ANIMATION ===========
function khoiTaoHieuUngReveal() {
    var danhSachCanAnimate = document.querySelectorAll(
        '.hero-text, .hero-image, .tai-sao-card, .cong-thuc-card, .ct-detail-card, .timeline-item, .thanh-vien-card, .cn-item, .ct-block, .sidebar-card, .form-container, .lh-info-card, .lh-note-card, .error-404-box'
    );

    danhSachCanAnimate.forEach(function(el, index) {
        el.classList.add('reveal-item');
        el.style.transitionDelay = (index % 8) * 0.06 + 's';
    });

    if (!('IntersectionObserver' in window)) {
        danhSachCanAnimate.forEach(function(el) {
            el.classList.add('show');
        });
        return;
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    danhSachCanAnimate.forEach(function(el) {
        observer.observe(el);
    });
}


// ========== HẠT SÁNG HERO ========== 
function taoHatSangHero() {
    var hero = document.querySelector('.hero-placeholder');
    if (!hero) return;

    for (var i = 0; i < 8; i++) {
        var hat = document.createElement('span');
        hat.className = 'hero-dot';
        hat.style.left = Math.random() * 92 + '%';
        hat.style.top = Math.random() * 92 + '%';
        hat.style.animationDelay = (Math.random() * 2).toFixed(2) + 's';
        hero.appendChild(hat);
    }
}


// ========== TILT CARD (WOW EFFECT) ==========
function khoiTaoHieuUngTiltCard() {
    if (window.matchMedia('(max-width: 992px)').matches) {
        return;
    }

    var dsCardTilt = document.querySelectorAll('.js-tilt-card, .tai-sao-card');

    dsCardTilt.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            var xoayY = ((x / rect.width) - 0.5) * 8;
            var xoayX = -((y / rect.height) - 0.5) * 8;

            card.style.transform = 'perspective(900px) rotateX(' + xoayX.toFixed(2) + 'deg) rotateY(' + xoayY.toFixed(2) + 'deg) translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
}


// ========== LOG THÔNG TIN ==========
console.log('Website Nguồn gốc Công thức VL12 đã sẵn sàng!');
console.log('Nhom: Vo-Viet-Anh');
