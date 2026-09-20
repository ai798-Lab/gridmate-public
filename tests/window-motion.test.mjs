import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix4, Quaternion, Euler, Vector3, Box3 } from '../assets/vendor/three/three.module.js';
import { layouts, poseAt, transitionPose, createMotion } from '../window-motion.js';

const tilts = [[0,0],[-.0225,-.0375],[-.0225,.0375],[.0225,-.0375],[.0225,.0375]];
// Deliberately larger than the rounded body, bevel and front-face geometry.
const bodyBounds = new Box3(new Vector3(-2.2,-1.35,-.04),new Vector3(2.2,1.35,.12));
const completeBounds = new Box3(new Vector3(-2.635,-1.95,-.14),new Vector3(2.715,1.77,.12));

function verify(poses, label, allTilts = true) {
  for (const [rx,ry] of allTilts ? tilts : [[0,0]]) {
    const assembly = new Matrix4().makeRotationFromEuler(new Euler(rx,ry,0));
    const matrices = poses.map(([x,y,z,ax,ay,az,scale]) =>
      new Matrix4().multiplyMatrices(assembly, new Matrix4().compose(
        new Vector3(x,y,z),new Quaternion().setFromEuler(new Euler(ax,ay,az)),new Vector3(scale,scale,scale))));
    const boxes = matrices.map(m => bodyBounds.clone().applyMatrix4(m));
    for (let i=0;i<4;i++) {
      const visible = completeBounds.clone().applyMatrix4(matrices[i]);
      assert.ok(visible.min.x>=-6.1 && visible.max.x<=6.1 && visible.min.y>=-3.55 && visible.max.y<=3.55, `${label}: panel ${i} clipped`);
      for (let j=i+1;j<4;j++) {
        const a=boxes[i],b=boxes[j];
        const gap=Math.max(b.min.x-a.max.x,a.min.x-b.max.x,b.min.y-a.max.y,a.min.y-b.max.y);
        assert.ok(gap>.08, `${label}: panels ${i}/${j} overlap or gap too small: ${gap}`);
      }
    }
  }
}

test('all final layouts remain separated throughout floating motion and pointer tilt', () => {
  for (const mode of Object.keys(layouts)) for (let i=0;i<720;i++) verify(poseAt(mode,i/12,true), `${mode}/${i}`);
});

test('all six directed transitions keep bodies and full shadow planes in bounds at every sampled frame', () => {
  for (const source of Object.keys(layouts)) for (const target of Object.keys(layouts)) {
    if (source===target) continue;
    for (const floatTime of [0,2.6,5.2,7.8]) for (let i=0;i<=240;i++) {
      verify(transitionPose(poseAt(source,floatTime,true),target,i/240),`${source}->${target}/${i}`);
    }
  }
});

test('rapid repeated input coalesces without intersecting and reaches the latest selection', () => {
  for (const fps of [30,60,144]) {
    const motion=createMotion();const modes=Object.keys(layouts);
    for (let frame=0;frame<fps*10;frame++) {
      if (frame%7===0) motion.request(modes[(frame*13)%3]);
      verify(motion.step(1/fps,frame/fps),`rapid ${fps}/${frame}`);
    }
    motion.request('focus');
    for(let frame=0;frame<fps*4;frame++) verify(motion.step(1/fps,10+frame/fps),`finish ${fps}/${frame}`);
    assert.equal(motion.current,'focus');assert.equal(motion.requested,'focus');assert.equal(motion.settled,true);
  }
});

test('pause preserves the in-flight pose and resume completes the requested layout', () => {
  const motion=createMotion('grid');motion.request('focus');
  motion.step(.6,.6);const before=motion.poses;
  for(let i=0;i<60;i++) assert.deepEqual(motion.step(1/60,1,false),before);
  for(let i=0;i<120;i++) verify(motion.step(1/60,1+i/60),'resume');
  assert.equal(motion.current,'focus');assert.equal(motion.settled,true);
});

test('paused/reduced-motion selections resolve instantly and repeated active selections do not restart', () => {
  const motion=createMotion();motion.request('focus');motion.step(.8,.8);
  motion.request('grid',true);assert.equal(motion.settled,true);assert.equal(motion.current,'grid');verify(motion.poses,'instant');
  motion.request('focus');
  for(let i=0;i<100;i++){motion.request('focus');motion.step(1/60,i/60);}
  assert.equal(motion.current,'focus');assert.equal(motion.settled,true);
});
