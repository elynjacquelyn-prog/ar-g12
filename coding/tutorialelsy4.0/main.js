// Import fungsi loadGLTF dan loadVideo dari modul loader.js
import { loadGLTF, loadVideo } from "../../libs/loader.js";
// Ruang nama THREE dari pustaka MINDAR.IMAGE
const THREE = window.MINDAR.IMAGE.THREE;

// Menunggu DOM untuk dimuat sepenuhnya sebelum melaksanakan kod
document.addEventListener('DOMContentLoaded', () => {
  // Fungsi start adalah fungsi asinkron yang memulakan pengalaman AR
  const start = async() => {
    // Mencipta contoh MindARThree dengan menetapkan bekas dan sumber sasaran gambar
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/lightoftheworld.mind',
    });
    // Mengakses renderer, scene, dan camera daripada contoh MindARThree
    const { renderer, scene, camera } = mindarThree;

    // Memuatkan video daripada fail dan mencipta tekstur dari video tersebut
    const video = await loadVideo("../../assets/videos/lightoftheworld.mp4");
    const texture = new THREE.VideoTexture(video);

    // Mencipta geometri muka objek 3D dan bahan (material) untuk menampung video
    const geometry = new THREE.PlaneGeometry(1, 204/480);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);

    // Menambahkan anchor kepada contoh MindARThree dan melekatkan muka objek 3D kepadanya
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    // Mengendalikan pemutaran video apabila sasaran ditemui atau hilang
    anchor.onTargetFound = () => {
      video.play();
    }
    anchor.onTargetLost = () => {
      video.pause();
    }
    
    // Menetapkan waktu permulaan video apabila ia dimainkan
    video.addEventListener('play', () => {
      video.currentTime = 6;
    });

    // Memulakan pengalaman AR menggunakan MindARThree
    await mindarThree.start();

    // Menetapkan loop animasi untuk merender seni AR secara berterusan
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  // Memanggil fungsi start untuk memulakan pengalaman AR
  start();
});
