const fileInputOne = document.getElementById("fileInputone");
const fileInputTwo = document.getElementById("fileInputtwo");
const downloadButton = document.querySelector(".output-download");



const readFileArrayBuffer = (File)=>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>resolve(reader.result);
    reader.onerror = reject
    reader.readAsArrayBuffer(File)
});
};

downloadButton.addEventListener("click" , async ()=>{
if(!fileInputOne.files.length || !fileInputTwo.files.length){
    alert("Please upload the both pdf files before downloading")
}else{
try {
    const pdffile1 = await readFileArrayBuffer(fileInputOne.files[0])
    const pdffile2 = await readFileArrayBuffer(fileInputTwo.files[0])

    const pdfDoc = await PDFLib.PDFDocument.create();
    const PDF1 = await PDFLib.PDFDocument.load(pdffile1)
    const PDF2 = await PDFLib.PDFDocument.load(pdffile2);

    const pdf1pages = await pdfDoc.copyPages(PDF1 , PDF1.getPageIndices())
    const pdf2pages = await pdfDoc.copyPages(PDF2 , PDF2.getPageIndices())

    pdf1pages.forEach(page => {
       return pdfDoc.addPage(page) 
    });

    pdf2pages.forEach(page => {
        return pdfDoc.addPage(page) 
     });
    
     const mergedpdfBytes = await pdfDoc.save();

     const blob = new Blob([mergedpdfBytes], {type:'application/pdf'})
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a')
     a.href = url ;
     a.download = "merged.pdf";
     document.body.appendChild(a)
     a.click();
     document.body.removeChild(a)
     URL.revokeObjectURL(url)
} catch (error) {
    console.error("Error in merging file ", error)
    alert("There was an error merging the PDFs. Please try again.")
}
}
})

