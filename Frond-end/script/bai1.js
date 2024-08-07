const sinhvien = {
    20204774: {
        name: 'Nguyễn Đức Quân',
        dob: '2002-06-22',
        gender: 'Nam',
        major: 'IT2'
    },
    20200180: {
        name: 'Trần Bách Lưu Đức',
        dob: '2002-06-20',
        gender: 'Nam',
        major: 'IT2'
    },
    20204775: {
        name: 'Lê Anh Tú',
        dob: '2002-04-15',
        gender: '',
        major: 'EE1'
    },
    20204776: {
        name: 'Phạm Thị Minh Thư',
        dob: '2002-07-10',
        gender: 'Nữ',
        major: 'IT1'
    },
    20204777: {
        name: 'Đỗ Thanh Hà',
        dob: '',
        gender: 'Nữ',
        major: 'EE2'
    }
};

const majors = {
    IT1 : 'Khoa học máy tính',
    IT2 : 'Kỹ học máy tính',
    EE1 : 'Kỹ thuật điện',
    EE2 : 'Tự động hóa'
}

const insertMajor = document.getElementById('insert-major');
const updateMajor = document.getElementById('update-major');
Object.keys(majors).forEach((major) => {
    const option1 = document.createElement('option');
    option1.innerText = majors[major];
    option1.value = major;
    insertMajor.appendChild(option1);

    const option2 = document.createElement('option');
    option2.innerText = majors[major];
    option2.value = major;
    updateMajor.appendChild(option2);
})

const overlay = document.getElementById('overlay')

const insertForm = document.getElementById('insert')
insertForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const mssv = document.getElementById('insert-mssv')
    const name = document.getElementById('insert-name')
    const dob = document.getElementById('insert-dob')
    const gender = document.querySelector('input[name="gender"]:checked')
    const major = document.getElementById('insert-major')

    const info = {
        mssv : mssv.value,
        name : name.value,
        dob : dob.value || '',
        gender : gender ? gender.value : '',
        major : major.value
    }

    if (addSinhVien(info)) {
        alert('Thêm thành công!');
        mssv.value = null
        name.value = null
        dob.value = null
        if (gender) gender.checked = false
        major.value = null
        const search = document.getElementById('search')
        if (!search.value) drawTable()
    } else {
        alert('Mã sinh viên: ' + mssv.value + ' đã tồn tại!'); 
        mssv.value = null
    }
})

const updateForm = document.getElementById('update-form')
const updateMssv = document.getElementById('update-mssv')
const updateName = document.getElementById('update-name')
const updateDob = document.getElementById('update-dob')
const updateGender = document.querySelectorAll('input[name="update-gender"]')
var mssvOld;

updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const gender = document.querySelector('input[name="update-gender"]:checked');
    const info = {
        mssv : updateMssv.value,
        name : updateName.value,
        dob : updateDob.value,
        gender : gender ? gender.value : '',
        major : updateMajor.value
    }

    console.log(info)

    if (updateSinhVien(mssvOld, info)) {
        alert('Cập nhật thành công')
        updateForm.style.display = 'none'
        overlay.style.display = 'none'
        deleteTableRow(mssvOld)
        insertTableRow(info.mssv)
    } else {
        alert('Cập nhật thất bại')
        updateMssv.value = mssvOld
        updateName.value = sinhvien[mssvOld].name
        updateDob.value = sinhvien[mssvOld].dob
        updateGender.forEach((radio) => {if (radio.value == sinhvien[mssvOld].gender) radio.checked = true})
        updateMajor.value = sinhvien[mssvOld].major
    }

})

let deleteList = {}

const table = document.getElementById('table')

function drawTable(listInput) {
    table.innerHTML = ''

    let list
    if (!listInput) list = sinhvien;
    else list = listInput;
    
    for (let mssv in list) insertTableRow(mssv)
}

function deleteTableRow(mssv) {
    const tr = document.getElementById(mssv)
    if (tr) {
        tr.remove();
    }
}

function insertTableRow(mssv) {
    const tr = document.createElement('tr')
    tr.id = mssv;

    const td0 = document.createElement('td')
    const selector = document.createElement('input')
    selector.type = "checkbox"
    selector.name = `selector-${mssv}`
    selector.addEventListener('change', () => {
        if (selector.checked) {
            deleteList[selector.name.slice(selector.name.search('-') + 1)] = true
        } else {
            delete deleteList[selector.name.slice(selector.name.search('-') + 1)]
        }
    })
    td0.appendChild(selector)
    tr.appendChild(td0)

    const td1 = document.createElement('td')
    td1.innerText = mssv
    tr.appendChild(td1)

    const td2 = document.createElement('td')
    td2.innerText = sinhvien[mssv].name
    tr.appendChild(td2)

    const td3 = document.createElement('td')
    td3.innerText = sinhvien[mssv].dob
    tr.appendChild(td3)

    const td4 = document.createElement('td')
    td4.innerText = sinhvien[mssv].gender
    tr.appendChild(td4)

    const td5 = document.createElement('td')
    td5.innerText = majors[sinhvien[mssv].major]
    tr.appendChild(td5)

    const td6 = document.createElement('td')
        const div = document.createElement('div')
        div.className = 'row-panel'
            const button1 = document.createElement('button')
            button1.className = 'update-button'
            button1.innerText = 'Cập nhật'
            button1.onclick = () => {
                overlay.style.display = 'block'
                updateForm.style.display = 'flex'
                mssvOld = mssv
                updateMssv.value = mssv
                updateName.value = sinhvien[mssv].name
                updateDob.value = sinhvien[mssv].dob
                updateGender.forEach((radio) => {if (radio.value == sinhvien[mssv].gender) radio.checked = true})
                const options = document.querySelectorAll('#update-major option')
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value == sinhvien[mssv].major) {
                        options[i].selected = true;
                    }
                }
            }

            const button2 = document.createElement('button')
            button2.className = 'delete-button'
            button2.innerText = 'Xóa'
            button2.onclick = () => {
                const confirmed = confirm('Bạn có chắc chắn muốn xóa không?');
                if (confirmed) {
                    deleteSinhVien(mssv)
                    alert('Xóa thành công')
                    deleteTableRow(mssv)
                }
            }

        div.appendChild(button1)
        div.appendChild(button2)
    td6.appendChild(div)
    tr.appendChild(td6)

    table.appendChild(tr)
}

function deleteSinhVien(mssv) {
    delete sinhvien[mssv];
}

function updateSinhVien(mssvOld, infor) {
    if (mssvOld == infor.mssv) {
        sinhvien[mssvOld] = infor
        return true
    }

    if (!sinhvien[infor.mssv]) {
        deleteSinhVien(mssvOld)
        sinhvien[infor.mssv] = infor
        return true
    }
    
    return false
}

function addSinhVien(infor) {
    if (sinhvien[infor.mssv]) {
        return false
    }
    else {
        sinhvien[infor.mssv] = {...infor}
        return true
    }
}

const search = document.getElementById('search')
search.addEventListener('input', () => {
    const result = {}
    for (let mssv in sinhvien) {
        let name = sinhvien[mssv].name.toLowerCase()
        let piece = search.value.toLowerCase()

        const from = "áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ";
        const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
        for (let i = 0, l = from.length; i < l; i++) {
            name = name.replace(new RegExp(from[i], "g"), to[i]);
            piece = piece.replace(new RegExp(from[i], "g"), to[i]);
        }
        if (name.search(piece) != -1) result[mssv] = sinhvien[mssv]
    }
    drawTable(result)
});

const deleteRowsButton = document.getElementById('delete-rows-button');
deleteRowsButton.addEventListener('click', () => {
    if (Object.keys(deleteList).length) {
        const userResponse  = confirm(`Bạn muốn xóa các hàng đã chọn ?`);
        if (userResponse ) {
            for (let mssv in deleteList) {
                deleteSinhVien(mssv)
                deleteTableRow(mssv)
            }
            deleteList = {}
            alert('Xoá thành công!')
        }
    }
})

drawTable(sinhvien)