import jsPDF from 'jspdf'

export function pdf_voucher(name, data) {
  const doc = new jsPDF('p', 'pt', 'a4')
  //Dimension of A4 in pts: 595 × 842
  let pageWidth = 595
  let pageHeight = 842

  const pageMargin = 20 // sebelumnya 10

  pageWidth -= pageMargin * 2
  pageHeight -= pageMargin * 2

  const cellPadding = 5
  const cellWidth = 120 // dicoba untuk memperkecil tabel
  const cellHeight = 70
  const lineHeight = 10

  let startX = pageMargin
  let startY = pageMargin

  function createCard(item, id_batch, package_name, reseller) {
    //cell projection
    const requiredWidth = startX + cellWidth + cellPadding * 2
    const requiredHeight = startY + cellHeight //+ (cellPadding * 2);
    if (requiredWidth <= pageWidth) {
      textWriter(item, id_batch, package_name, reseller, startX + cellPadding, startY + cellPadding)
      startX = requiredWidth
      //  startY += cellHeight + cellPadding;
    } else {
      if (requiredHeight > pageHeight) {
        doc.addPage()
        startY = pageMargin
      } else {
        startY = requiredHeight
      }
      startX = pageMargin
      textWriter(item, id_batch, package_name, reseller, startX + cellPadding, startY + cellPadding)
      startX = startX + cellWidth + cellPadding * 2
    }
  }

  function setFont(size, type) {
    doc.setFontSize(size)

    let fontType = 'normal'
    if (type === 1) {
      fontType = 'bold'
    } else if (type === 2) {
      fontType = 'italic'
    }

    doc.setFont(undefined, fontType)
  }

  function textWriter(item, id_batch, package_name, reseller, xAxis, yAxis) {
    doc.rect(startX - cellPadding, startY - cellPadding, cellWidth, cellHeight - cellPadding * 2)
    setFont(6, 2)
    doc.text('batch\t\t: ' + id_batch, xAxis, yAxis)
    doc.text('paket\t\t: ' + package_name, xAxis, yAxis + lineHeight)
    setFont(16, 1)
    doc.text(item.username, xAxis, yAxis + lineHeight * 3)
    setFont(6, 0)
    doc.text('RESELLER: ' + reseller, xAxis, yAxis + (lineHeight / 2 + lineHeight * 4))
  }

  setFont(6, 0)

  for (let i = 0; i < data.order_hotspot.vouchers.length; i++) {
    createCard(data.order_hotspot.vouchers[i], data.id_batch, data.order_hotspot.package.name, data.customer.name)
  }

  return doc.save(name + 'report.pdf')
}
