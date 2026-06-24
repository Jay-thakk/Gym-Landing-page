import * as THREE from 'three';
  const container=document.getElementById('canvas-container');
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x07060a);
  const camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0,15,35);camera.lookAt(0,0,0);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  container.appendChild(renderer.domElement);

  const isMobile = window.innerWidth < 768;

const numX = isMobile ? 40 : 95;
const numZ = isMobile ? 40 : 95;

const sep = 1.6;
  const count=numX*numZ;
  const positions=new Float32Array(count*3);
  const colors=new Float32Array(count*3);
  const cPrimary=new THREE.Color(0xff1530);
  const cSecondary=new THREE.Color(0xffb800);
  let i=0;
  for(let x=0;x<numX;x++)for(let z=0;z<numZ;z++){
    positions[i]=(x-numX/2)*sep;positions[i+1]=0;positions[i+2]=(z-numZ/2)*sep;
    const mixed=cPrimary.clone().lerp(cSecondary,(x/numX)*(z/numZ));
    colors[i]=mixed.r;colors[i+1]=mixed.g;colors[i+2]=mixed.b;i+=3;
  }
  const geom=new THREE.BufferGeometry();
  geom.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geom.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const mat=new THREE.PointsMaterial({size:0.18,vertexColors:true,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending});
  const ps=new THREE.Points(geom,mat);scene.add(ps);

  let mX=0,mZ=0,tX=0,tZ=0;
  window.addEventListener('mousemove',e=>{tX=((e.clientX/window.innerWidth)-0.5)*40;tZ=((e.clientY/window.innerHeight)-0.5)*40;});
  const clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const t=clock.getElapsedTime();
    const arr=ps.geometry.attributes.position.array;
    mX+=(tX-mX)*0.05;mZ+=(tZ-mZ)*0.05;
    let idx=0;
    for(let x=0;x<numX;x++)for(let z=0;z<numZ;z++){
      const pX=arr[idx],pZ=arr[idx+2];
      let w=Math.sin(x*0.15+t*1.2)*1.5+Math.cos(z*0.15+t*1.0)*1.5;
      const dx=pX-mX,dz=pZ-mZ,d=Math.sqrt(dx*dx+dz*dz);
      if(d<18)w-=Math.sin(((18-d)/18)*Math.PI)*4.5;
      arr[idx+1]=w;idx+=3;
    }
    ps.geometry.attributes.position.needsUpdate=true;
    ps.rotation.y=t*0.02;
    renderer.render(scene,camera);
  }
  animate();
  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  });

  // 3D card tilt — PRESERVED
  document.querySelectorAll('.card-3d').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2;
      const y=e.clientY-r.top-r.height/2;
      card.style.transform=`rotateX(${-y/15}deg) rotateY(${x/15}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='rotateX(0deg) rotateY(0deg) translateY(0px)';});
  });