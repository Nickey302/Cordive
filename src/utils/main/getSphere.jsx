import * as THREE from 'three';

function getPoint(v, size, data, offset) {
  v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
  if (v.length() > 1) return getPoint(v, size, data, offset);
  return v.normalize().multiplyScalar(size).toArray(data, offset);
}

export function getSphere(count, size, p = new THREE.Vector4()) {
  const data = new Float32Array(count * 4);
  for (let i = 0; i < count * 4; i += 4) getPoint(p, size, data, i);
  return data;
}
