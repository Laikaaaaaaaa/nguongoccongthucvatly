
try:
    from flask import Flask, render_template, request, jsonify
except ModuleNotFoundError:
    print("[LỖI] Chưa cài Flask cho Python hiện tại.")
    print("[GỢI Ý] Nếu dùng virtual environment của project, hãy chạy:")
    print("         .\\.venv\\Scripts\\python.exe app.py")
    print("[GỢI Ý] Hoặc cài dependency bằng:")
    print("         python -m pip install -r requirements.txt")
    raise SystemExit(1)

import json
import os

# ========== KHỞI TẠO APP ==========
app = Flask(__name__)

# Đường dẫn tới file dữ liệu JSON
DUONG_DAN_DU_LIEU = os.path.join(os.path.dirname(__file__), 'data', 'cong_thuc.json')


def doc_du_lieu():
    """Hàm đọc dữ liệu từ file JSON
    Trả về danh sách các công thức vật lí
    """
    try:
        with open(DUONG_DAN_DU_LIEU, 'r', encoding='utf-8') as f:
            ds_cong_thuc = json.load(f)
        return ds_cong_thuc
    except FileNotFoundError:
        print("[LỖI] Không tìm thấy file cong_thuc.json!")
        return []
    except json.JSONDecodeError:
        print("[LỖI] File JSON bị lỗi cú pháp!")
        return []


def tim_cong_thuc_theo_id(id_cong_thuc):
    """Tìm 1 công thức theo ID
    Trả về dict nếu tìm thấy, None nếu không
    """
    ds_cong_thuc = doc_du_lieu()
    for cong_thuc in ds_cong_thuc:
        if cong_thuc['id'] == id_cong_thuc:
            return cong_thuc
    return None


# ========== CÁC ROUTE ==========

@app.route('/')
def trang_chu():
    """Route trang chủ"""
    ds_cong_thuc = doc_du_lieu()
    return render_template('trang_chu.html', ds_cong_thuc=ds_cong_thuc)


@app.route('/gioi-thieu')
def gioi_thieu():
    """Route trang giới thiệu"""
    return render_template('gioi_thieu.html')


@app.route('/noi-dung')
def noi_dung():
    """Route trang nội dung chính - danh sách công thức"""
    ds_cong_thuc = doc_du_lieu()
    return render_template('noi_dung.html', ds_cong_thuc=ds_cong_thuc)


@app.route('/cong-thuc/<int:id>')
def chi_tiet_cong_thuc(id):
    """Route trang chi tiết 1 công thức
    Nhận id từ URL, tìm trong dữ liệu và hiển thị
    """
    thong_tin = tim_cong_thuc_theo_id(id)

    if thong_tin is None:
        # Nếu không tìm thấy thì báo lỗi 404
        return render_template('404.html'), 404

    return render_template('chi_tiet.html', cong_thuc=thong_tin)


@app.route('/lien-he', methods=['GET', 'POST'])
def lien_he():
    """Route trang liên hệ
    GET: hiển thị form
    POST: nhận dữ liệu từ form và xử lý
    """
    thong_bao = None

    if request.method == 'POST':
        # Lấy dữ liệu từ form
        ho_ten = request.form.get('ho_ten', '').strip()
        email = request.form.get('email', '').strip()
        noi_dung_lh = request.form.get('noi_dung', '').strip()

        # Kiểm tra dữ liệu cơ bản
        if not ho_ten or not email or not noi_dung_lh:
            thong_bao = {
                'loai': 'loi',
                'noi_dung': 'Vui lòng điền đầy đủ thông tin!'
            }
        else:
            # Giả lập gửi email - in ra console
            print("=" * 50)
            print("📧 NHẬN ĐƯỢC LIÊN HỆ MỚI:")
            print(f"   Họ tên:   {ho_ten}")
            print(f"   Email:    {email}")
            print(f"   Nội dung: {noi_dung_lh}")
            print("=" * 50)

            thong_bao = {
                'loai': 'thanh_cong',
                'noi_dung': 'Cảm ơn bạn đã liên hệ! Chúng mình sẽ phản hồi sớm nhất có thể.'
            }

    return render_template('lien_he.html', thong_bao=thong_bao)


# ========== API GIẢ LẬP TẠO VIDEO AI ==========

@app.route('/api/tao-video', methods=['POST'])
def tao_video_ai():
    """API giả lập tạo video AI
    Nhận id công thức, giả lập xử lý và trả về kết quả
    """
    du_lieu = request.get_json()
    id_cong_thuc = du_lieu.get('id_cong_thuc')

    thong_tin = tim_cong_thuc_theo_id(id_cong_thuc)

    if thong_tin is None:
        return jsonify({
            'trang_thai': 'loi',
            'thong_bao': 'Không tìm thấy công thức!'
        }), 404

    # Giả lập trả về video mẫu
    print(f"[AI VIDEO] Đang giả lập tạo video cho: {thong_tin['ten_cong_thuc']}")

    return jsonify({
        'trang_thai': 'thanh_cong',
        'thong_bao': f'Đã tạo video AI cho "{thong_tin["ten_cong_thuc"]}" thành công!',
        'video_url': thong_tin.get('video_youtube', ''),
        'ten_cong_thuc': thong_tin['ten_cong_thuc']
    })


# ========== XỬ LÝ LỖI ==========

@app.errorhandler(404)
def khong_tim_thay(e):
    """Xử lý lỗi 404 - không tìm thấy trang"""
    return render_template('404.html'), 404


# ========== CHẠY APP ==========
if __name__ == '__main__':
    print("🚀 Server đang chạy tại http://localhost:5000")
    print("📚 Dự án: Nguồn gốc Công thức Vật Lí 12")
    print("-" * 45)
    app.run(debug=True, host='0.0.0.0', port=5000)
