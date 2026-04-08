import fs from 'fs';
import https from 'https';
import path from 'path';

const ids = [
  "1VTUj0Ngod53QFf_ovjGsxubADyhwt12Z", "1ebkuWcrzwrTkG_bwPDmEIhc2w3Blb_ZQ", "15-Qi9KJpRgZStrGqyY7FZbZ6I5JLCGFN", "1Ihd5uwizw64jk8PrNySSYLbSAkd0A1Oe", "1xQ70xPaeFaNuYG5Bx5yIhZrIX4JxOWKX",
  "134qb6zRSaO9G8W63VBz1jKKWhNM7MSsi", "14ZJoBDEERnH-rNMpxfZyp4jgLmGa6D5x", "1R7pYPwyLfisBlD4UMMDriuLfACVzVniI", "1bwM12Ynxy0n_XWTcrzeLVtkgdJnoI5lI", "1DZAFfXwfpa9Jfw7BVmiyv4HT3kA_GElY",
  "1sCWBvrLnknu3HqX50Cb_A6ufnz96UI8R", "1agKslOH72fq6jGOwFhW-fUW4ckJX6cHq", "1-fCfWhcoKnvmmhKqq-rlFNu_nqpPFN-0", "1MdIyT_qiJZbim-kLLaUAe7w8kYRPs2KU", "1JaV_kR0aRJrCOFTNfDyNlMr7rcCXdYZX",
  "1Gmz8Zj9qsV2Vx4WFPANvfixLH2CM0PXM", "1SnoZZTrvPFjPui8OmpbuQptPsNhPJP9X", "1a8KKRGMZTDhPGwcp_i53-ZcXRiDdLE0T", "10w2YhsMfc8JUUj25JZ8Cfo85IG9WUd9C", "11WVnazYE96P0-7gSlhB9Az3covoBznVA",
  "1X8dgxFdZ7paCyduehMv3thyT8n4P2-Om", "168XbBIpmq3RdkuQIhBFLDkvZbdW31WLY", "1TuIB_-lcKXQCj9wOE_Owip-xwmFUibn3", "14fWODgBvIbRSgiWqbb9rTmKdRHqVl3fn", "1Fvuq3BRE6sNU65FOHsVPPDcKCwNvc_Io",
  "1QUJe3izKom0KHTZVbqY7LSdlRuEFTIoM", "1V7RU-WiUPVWE8AVhicr31sHegRHjKd3e", "1DETsXu4hn0_sYEYpJ87z2aypwiL73uXq", "1ef3RV2S9I650Wwys3uCp72bI3T2GlbRY", "1Dih0y427ub6YfsTd1lkRkEmGrVOs_M1I",
  "19IcnKPdTN80vNjsyuH98oK0GzOiMtYGL", "1XLtTxGFYIQFo7XSwuSj35TyE1n21DbQk", "10Un_LFZAeC97XhnC5raCaEoDaAgTra-9", "1AtRlP-cwElzIXRhfpbFzPqYN-Vn6il_c", "1E3pkNhEQL3Wn_XTQ7D6FA4mzH2jiJ16C",
  "1mrJR9CTLFgvr6IafY15-AzYRYOJEKStf", "1JUWRHE0rEZVXkYxiDAy3RZSttTzpKnxo", "10PA6NBIlRedLObH17DJ82lAk9DigdCL6", "1a8SQ8mCchx5dpCkG9fjTXOwnO-p1ublH", "1Usj_uTLTA_s5h-FnpU8WLOduudLoz-Al",
  "17d9fowp-g72FDrDucHTbftyfhI4H9NIc", "1X7cr0mjQqKr73tL-gE4akKprSMRos6W_", "1Bx0zqkz_HYNY6I91jLOt-4-Y7Ia_y-fl", "16AHzTwVxPHoZWIIc0Og6Jxj00tbsebf5", "10ZSr82lgho6ItH-By4h17bZEUPju2zTU",
  "11opw5GQ5Bh2mXYVqso1kePPAVgINar_p", "1cpOp7yzA5WxreSG3JS7GJs2zhqVlyhko", "1w7odhdq00Vw2ophUBDY8jUPnjXSgLgXk", "1dW8Ks4wAn11LXziRfnXFe3DnPvnN6ps_", "1b8vnyIQC-pX-KpyJcDAC6dvj8WbMysIK"
];

const destFolder = 'C:/Users/welli/Downloads/semin-50-mineracao-main/semin-50-mineracao/src/assets/gallery';
if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else {
        reject(`Status code: ${res.statusCode}`);
      }
    }).on('error', reject);
  });
}

(async () => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const url = `https://lh3.googleusercontent.com/d/${id}`;
    const dest = path.join(destFolder, `gallery_${i + 1}.jpg`);
    try {
      console.log(`Downloading ${i + 1}/${ids.length}...`);
      await downloadFile(url, dest);
    } catch (err) {
      console.error(`Error downloading ${id}:`, err);
    }
  }
  console.log('All downloads finished.');
})();
