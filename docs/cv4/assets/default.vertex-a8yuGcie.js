import{S as e}from"./shaderStore-D7CeNWBX.js";import{s as o}from"./sceneUboDeclaration-Ce3H1HSE.js";import{m as d}from"./meshUboDeclaration-DC7rtoOm.js";import{d as f}from"./defaultUboDeclaration-DWLjBhX4.js";import{u as l,p as s,s as c,b as E,v,a as m,c as u,d as p,e as I,f as _}from"./bumpVertex-C85d7M6H.js";import{helperFunctionsWGSL as A}from"./helperFunctions-DdMzpYci.js";import{b as N,a as x,c as S,i as V,d as M,e as L,f as D}from"./clipPlaneVertex-BgNFt7-Q.js";import{i as T}from"./instancesDeclaration-BulZKtBf.js";import{m as R}from"./mainUVVaryingDeclaration-PIZaA00D.js";import{f as G,a as U}from"./fogVertex-Cx1Il3q4.js";import{l as W,s as O,a as g}from"./logDepthVertex-CH3g7pnt.js";import{m as h,a as P,b as C,c as X}from"./morphTargetsVertex-BInwYMGT.js";import{l as F}from"./logDepthDeclaration-C6aCvWlP.js";import{v as b}from"./vertexColorMixing-Zz8RMzzE.js";const t="lightVxFragmentDeclaration",a=`#ifdef LIGHT{X}
uniform vLightData{X}: vec4f;uniform vLightDiffuse{X}: vec4f;
#ifdef SPECULARTERM
uniform vLightSpecular{X}: vec4f;
#else
var vLightSpecular{X}: vec4f= vec4f(0.);
#endif
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform lightMatrix{X}: mat4x4f[SHADOWCSMNUM_CASCADES{X}];varying var vPositionFromLight{X}: vec4f[SHADOWCSMNUM_CASCADES{X}];varying var vDepthMetric{X}: f32[SHADOWCSMNUM_CASCADES{X}];varying var vPositionFromCamera{X}: vec4f;
#elif defined(SHADOWCUBE{X})
#else
varying var vPositionFromLight{X}: vec4f;varying var vDepthMetric{X}: f32;uniform lightMatrix{X}: mat4x4f;
#endif
uniform shadowsInfo{X}: vec4f;uniform depthValues{X}: vec2f;
#endif
#ifdef SPOTLIGHT{X}
uniform vLightDirection{X}: vec4f;uniform vLightFalloff{X}: vec4f;
#elif defined(POINTLIGHT{X})
uniform vLightFalloff{X}: vec4f;
#elif defined(HEMILIGHT{X})
uniform vLightGround{X}: vec3f;
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
uniform vLightWidth{X}: vec4f;uniform vLightHeight{X}: vec4f;
#endif
#endif
`;e.IncludesShadersStoreWGSL[t]||(e.IncludesShadersStoreWGSL[t]=a);const H={name:t,shader:a},r="defaultVertexShader",n=`#include<defaultUboDeclaration>
#define CUSTOM_VERTEX_BEGIN
#ifndef USE_VERTEX_PULLING
attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#ifdef TANGENT
attribute tangent: vec4f;
#endif
#ifdef UV1
attribute uv: vec2f;
#endif
#include<uvAttributeDeclaration>[2..7]
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#endif
#include<helperFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<prePassVertexDeclaration>
#include<mainUVVaryingDeclaration>[1..7]
#include<samplerVertexDeclaration>(_DEFINENAME_,DIFFUSE,_VARYINGNAME_,Diffuse)
#include<samplerVertexDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail)
#include<samplerVertexDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient)
#include<samplerVertexDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity)
#include<samplerVertexDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive)
#include<samplerVertexDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap)
#if defined(SPECULARTERM)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR,_VARYINGNAME_,Specular)
#endif
#include<samplerVertexDeclaration>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump)
#include<samplerVertexDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal)
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<bumpVertexDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#include<logDepthDeclaration>
#include<vertexPullingDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef USE_VERTEX_PULLING
var positionUpdated: vec3f=vec3f(0.0);
#ifdef NORMAL
var normalUpdated: vec3f=vec3f(0.0);
#endif
#ifdef TANGENT
var tangentUpdated: vec4f=vec4f(0.0);
#endif
#ifdef UV1
var uvUpdated: vec2f=vec2f(0.0);
#endif
#ifdef UV2
var uv2Updated: vec2f=vec2f(0.0);
#endif
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vec4f(0.0);
#endif
#else
var positionUpdated: vec3f=vertexInputs.position;
#ifdef NORMAL
var normalUpdated: vec3f=vertexInputs.normal;
#endif
#ifdef TANGENT
var tangentUpdated: vec4f=vertexInputs.tangent;
#endif
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#endif
#include<vertexPullingVertex>
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
vertexOutputs.vPositionUVW=positionUpdated;
#endif
#define CUSTOM_VERTEX_UPDATE_POSITION
#define CUSTOM_VERTEX_UPDATE_NORMAL
#include<instancesVertex>
#if defined(PREPASS) && ((defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vertexOutputs.vCurrentPosition=scene.viewProjection*finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld*vec4f(positionUpdated,1.0);
#endif
#ifdef USE_VERTEX_PULLING
#include<bonesVertex>(vertexInputs.matricesIndices,vp_matricesIndices,vertexInputs.matricesWeights,vp_matricesWeights,vertexInputs.matricesIndicesExtra,vp_matricesIndicesExtra,vertexInputs.matricesWeightsExtra,vp_matricesWeightsExtra)
#include<bakedVertexAnimation>(vertexInputs.matricesIndices,vp_matricesIndices,vertexInputs.matricesWeights,vp_matricesWeights,vertexInputs.matricesIndicesExtra,vp_matricesIndicesExtra,vertexInputs.matricesWeightsExtra,vp_matricesWeightsExtra)
#else
#include<bonesVertex>
#include<bakedVertexAnimation>
#endif
var worldPos: vec4f=finalWorld*vec4f(positionUpdated,1.0);
#ifdef NORMAL
var normalWorld: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vertexOutputs.vNormalW=normalUpdated/ vec3f(dot(normalWorld[0],normalWorld[0]),dot(normalWorld[1],normalWorld[1]),dot(normalWorld[2],normalWorld[2]));vertexOutputs.vNormalW=normalize(normalWorld*vertexOutputs.vNormalW);
#else
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vertexOutputs.vNormalW=normalize(normalWorld*normalUpdated);
#endif
#endif
#define CUSTOM_VERTEX_UPDATE_WORLDPOS
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {vertexOutputs.position=scene.viewProjection*worldPos;} else {vertexOutputs.position=scene.viewProjectionR*worldPos;}
#else
vertexOutputs.position=scene.viewProjection*worldPos;
#endif
vertexOutputs.vPositionW= worldPos.xyz;
#ifdef PREPASS
#include<prePassVertex>
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vertexOutputs.vDirectionW=normalize((finalWorld* vec4f(positionUpdated,0.0)).xyz);
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
#ifdef RIGHT_HANDED
vertexOutputs.vViewDepth=-(scene.view*worldPos).z;
#else
vertexOutputs.vViewDepth=(scene.view*worldPos).z;
#endif
#endif
#ifndef UV1
var uvUpdated: vec2f=vec2f(0.,0.);
#endif
#ifdef MAINUV1
vertexOutputs.vMainUV1=uvUpdated;
#endif
#ifndef UV2
var uv2Updated: vec2f=vec2f(0.,0.);
#endif
#ifdef MAINUV2
vertexOutputs.vMainUV2=uv2Updated;
#endif
#include<uvVariableDeclaration>[3..7]
#include<samplerVertexImplementation>(_DEFINENAME_,DIFFUSE,_VARYINGNAME_,Diffuse,_MATRIXNAME_,diffuse,_INFONAME_,DiffuseInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_MATRIXNAME_,detail,_INFONAME_,DetailInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_MATRIXNAME_,ambient,_INFONAME_,AmbientInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_MATRIXNAME_,opacity,_INFONAME_,OpacityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_MATRIXNAME_,emissive,_INFONAME_,EmissiveInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_MATRIXNAME_,lightmap,_INFONAME_,LightmapInfos.x)
#if defined(SPECULARTERM)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR,_VARYINGNAME_,Specular,_MATRIXNAME_,specular,_INFONAME_,SpecularInfos.x)
#endif
#include<samplerVertexImplementation>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump,_MATRIXNAME_,bump,_INFONAME_,BumpInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_MATRIXNAME_,decal,_INFONAME_,DecalInfos.x)
#include<bumpVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=n);const Y=[o,d,f,l,A,N,x,T,s,R,c,E,S,G,H,W,h,P,F,v,m,C,X,V,M,L,u,p,I,_,D,U,O,b,g];for(const i of Y)e.IncludesShadersStoreWGSL[i.name]||(e.IncludesShadersStoreWGSL[i.name]=i.shader);const te={name:r,shader:n};export{te as defaultVertexShaderWGSL};
