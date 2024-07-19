const sinhvien = [
]
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
        dob : dob.value,
        gender : gender.value,
        major : major.value
    }

    mssv.value = null
    name.value = null
    dob.value = null
    gender.checked = false
    major.value = null
    
    sinhvien.push(info)
    
    console.log(info)

    const search = document.getElementById('search')
    if (!search.value) {
        drawTable(sinhvien)
    }
})

function drawTable(rows) {
    const table = document.getElementById('table')
    table.innerHTML = `        
        <caption>Kết quả tìm kiếm</caption>
        
        <tr>
            <th>MSSV</th>
            <th>Tên sinh viên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Khoa</th>
            <th>Thao tác</th>
        </tr>
    `
    rows.forEach(row => {
        const tr = document.createElement('tr')

        const td1 = document.createElement('td')
        td1.innerText = row.mssv
        tr.appendChild(td1)

        const td2 = document.createElement('td')
        td2.innerText = row.name
        tr.appendChild(td2)

        const td3 = document.createElement('td')
        td3.innerText = row.dob
        tr.appendChild(td3)

        const td4 = document.createElement('td')
        td4.innerText = row.gender == 'nam' ? 'Nam' : 'Nữ'
        tr.appendChild(td4)

        const td5 = document.createElement('td')
        td5.innerText = row.major
        tr.appendChild(td5)

        const td6 = document.createElement('td')
            const div = document.createElement('div')
            div.className = 'row-panel'
                const button1 = document.createElement('button')
                button1.className = 'update-button'
                button1.innerText = 'Cập nhật'

                const button2 = document.createElement('button')
                button2.className = 'delete-button'
                button2.innerText = 'Xóa'

            div.appendChild(button1)
            div.appendChild(button2)
        td6.appendChild(div)
        tr.appendChild(td6)

        table.appendChild(tr)
    });

}