import { Subject, Subscription } from 'rxjs';
import { mat4, vec3, vec4, vec2 } from 'gl-matrix';
import * as nifti from 'nifti-reader-js';
import { WebSocketSubject } from 'rxjs/webSocket';

type ColorMap = {
    R: number[];
    G: number[];
    B: number[];
    A: number[];
    I: number[];
    min?: number;
    max?: number;
    labels?: string[];
};
type LUT = {
    lut: Uint8ClampedArray;
    min?: number;
    max?: number;
    labels?: string[];
};
declare class ColorTables {
    gamma: number;
    version: number;
    cluts: Record<string, ColorMap>;
    /**
     * Sets cluts to alphabetically sorted cmaps
     */
    constructor();
    addColormap(key: string, cmap: ColorMap): void;
    colormaps(): Array<keyof typeof this.cluts>;
    colorMaps(): Array<keyof typeof this.cluts>;
    colormapFromKey(name: string): ColorMap;
    colormap(key?: string, isInvert?: boolean): Uint8ClampedArray;
    makeLabelLut(cm: ColorMap, alphaFill?: number): LUT;
    makeLabelLutFromUrl(name: string): Promise<LUT>;
    makeDrawLut(name: string | ColorMap): LUT;
    makeLut(Rsi: number[], Gsi: number[], Bsi: number[], Asi: number[], Isi: number[], isInvert: boolean): Uint8ClampedArray;
}
declare const cmapper: ColorTables;

declare class Shader {
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation | null>;
    isMatcap?: boolean;
    constructor(gl: WebGL2RenderingContext, vertexSrc: string, fragmentSrc: string);
    use(gl: WebGL2RenderingContext): void;
}

type Geometry = {
    vertexBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    indexCount: number;
    vao: WebGLVertexArrayObject | null;
};
/**
 * Object rendered with WebGL
 **/
declare class NiivueObject3D {
    static BLEND: number;
    static CULL_FACE: number;
    static CULL_FRONT: number;
    static CULL_BACK: number;
    static ENABLE_DEPTH_TEST: number;
    sphereIdx: number[];
    sphereVtx: number[];
    renderShaders: number[];
    isVisible: boolean;
    isPickable: boolean;
    vertexBuffer: WebGLVertexArrayObject;
    indexCount: number;
    indexBuffer: WebGLVertexArrayObject | null;
    vao: WebGLVertexArrayObject | null;
    mode: number;
    glFlags: number;
    id: number;
    colorId: [number, number, number, number];
    modelMatrix: mat4;
    scale: number[];
    position: number[];
    rotation: number[];
    rotationRadians: number;
    extentsMin: number[];
    extentsMax: number[];
    furthestVertexFromOrigin?: number;
    originNegate?: vec3;
    fieldOfViewDeObliqueMM?: vec3;
    mm?: vec4;
    constructor(id: number, vertexBuffer: WebGLBuffer, mode: number, indexCount: number, indexBuffer?: WebGLVertexArrayObject | null, vao?: WebGLVertexArrayObject | null);
    static generateCrosshairs: (gl: WebGL2RenderingContext, id: number, xyzMM: vec4, xyzMin: vec3, xyzMax: vec3, radius: number, sides?: number) => NiivueObject3D;
    static generateCrosshairsGeometry: (gl: WebGL2RenderingContext, xyzMM: vec4, xyzMin: vec3, xyzMax: vec3, radius: number, sides?: number) => Geometry;
    static getFirstPerpVector: (v1: vec3) => vec3;
    static subdivide: (verts: number[], faces: number[]) => void;
    static weldVertices: (verts: number[], faces: number[]) => number[];
    static makeSphere: (vertices: number[], indices: number[], radius: number, origin?: vec3 | vec4) => void;
    static makeCylinder: (vertices: number[], indices: number[], start: vec3, dest: vec3, radius: number, sides?: number, endcaps?: boolean) => void;
    static makeColoredCylinder: (vertices: number[], indices: number[], colors: number[], start: vec3, dest: vec3, radius: number, rgba255?: number[], sides?: number, endcaps?: boolean) => void;
    static makeColoredSphere: (vertices: number[], indices: number[], colors: number[], radius: number, origin?: vec3 | vec4, rgba255?: number[]) => void;
}

declare enum LabelTextAlignment {
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center"
}
declare enum LabelLineTerminator {
    NONE = "none",
    CIRCLE = "circle",
    RING = "ring"
}
/**
 * Class representing label style.
 */
declare class NVLabel3DStyle {
    textColor: number[];
    textScale: number;
    textAlignment?: LabelTextAlignment;
    lineWidth: number;
    lineColor: number[];
    lineTerminator: LabelLineTerminator;
    bulletScale?: number;
    bulletColor?: number[];
    backgroundColor?: number[];
    /**
     * @param textColor - Color of text
     * @param textScale - Text Size (0.0..1.0)
     * @param lineWidth - Line width
     * @param lineColor - Line color
     * @param bulletScale - Bullet size respective of text
     * @param bulletColor - Bullet color
     * @param backgroundColor - Background color of label
     */
    constructor(textColor?: number[], textScale?: number, textAlignment?: LabelTextAlignment, lineWidth?: number, lineColor?: number[], lineTerminator?: LabelLineTerminator, bulletScale?: number, bulletColor?: number[], backgroundColor?: number[]);
}
/**
 * Label class
 */
declare class NVLabel3D {
    text: string;
    style: NVLabel3DStyle;
    points?: number[] | number[][];
    /**
     * @param text - The text of the label
     * @param style - The style of the label
     * @param points - An array of points label for label lines
     */
    constructor(text: string, style: NVLabel3DStyle, points?: number[] | number[][]);
}

type NiftiHeader = {
    littleEndian: boolean;
    dim_info: number;
    dims: number[];
    pixDims: number[];
    intent_p1: number;
    intent_p2: number;
    intent_p3: number;
    intent_code: number;
    datatypeCode: number;
    numBitsPerVoxel: number;
    slice_start: number;
    vox_offset: number;
    scl_slope: number;
    scl_inter: number;
    slice_end: number;
    slice_code: number;
    xyzt_units: number;
    cal_max: number;
    cal_min: number;
    slice_duration: number;
    toffset: number;
    description: string;
    aux_file: string;
    qform_code: number;
    sform_code: number;
    quatern_b: number;
    quatern_c: number;
    quatern_d: number;
    qoffset_x: number;
    qoffset_y: number;
    qoffset_z: number;
    affine: number[][];
    intent_name: string;
    magic: string;
};
type Point = {
    comments: Array<{
        text: string;
        prefilled?: string;
    }>;
    coordinates: {
        x: number;
        y: number;
        z: number;
    };
};
/**
 * Representes the vertices of a connectome
 */
type NVConnectomeNode = {
    name: string;
    x: number;
    y: number;
    z: number;
    colorValue: number;
    sizeValue: number;
    label?: NVLabel3D;
};
/**
 * Represents edges between connectome nodes
 */
type NVConnectomeEdge = {
    first: number;
    second: number;
    colorValue: number;
};
type ConnectomeOptions = {
    name: string;
    nodeColormap: string;
    nodeColormapNegative: string;
    nodeMinColor: number;
    nodeMaxColor: number;
    nodeScale: number;
    edgeColormap: string;
    edgeColormapNegative: string;
    edgeMin: number;
    edgeMax: number;
    edgeScale: number;
};
type Connectome = ConnectomeOptions & {
    nodes: NVConnectomeNode[];
    edges: NVConnectomeEdge[];
};
type LegacyNodes = {
    names: string[];
    prefilled: unknown[];
    X: number[];
    Y: number[];
    Z: number[];
    Color: number[];
    Size: number[];
};
type LegacyConnectome = Partial<ConnectomeOptions> & {
    nodes: LegacyNodes;
    edges: number[];
};

type ValuesArray = Array<{
    id: string;
    vals: number[];
    global_min?: number;
    global_max?: number;
    cal_min?: number;
    cal_max?: number;
}>;
type TypedNumberArray = Float64Array | Float32Array | Uint32Array | Uint16Array | Uint8Array | Int32Array | Int16Array | Int8Array;
type AnyNumberArray = number[] | TypedNumberArray;
type DefaultMeshType = {
    positions: Float32Array;
    indices: Int32Array;
    colors?: Float32Array;
};
type TRACT = {
    pts: number[];
    offsetPt0: number[];
    dps: ValuesArray;
};
type TT = {
    pts: number[];
    offsetPt0: number[];
};
type TRX = {
    pts: number[];
    offsetPt0: number[];
    dpg: ValuesArray;
    dps: ValuesArray;
    dpv: ValuesArray;
    header: unknown;
};
type TRK = {
    pts: Float32Array;
    offsetPt0: Uint32Array;
    dps: ValuesArray;
    dpv: ValuesArray;
};
type TCK = {
    pts: Float32Array;
    offsetPt0: Uint32Array;
};
type VTK = DefaultMeshType | {
    pts: Float32Array;
    offsetPt0: Uint32Array;
};
type ANNOT = Uint32Array | {
    scalars: Float32Array;
    colormapLabel: LUT;
};
type MZ3 = Float32Array | {
    positions: Float32Array | null;
    indices: Int32Array | null;
    scalars: Float32Array;
    colors: Float32Array | null;
};
type GII = {
    scalars: Float32Array;
    positions?: Float32Array;
    indices?: Int32Array;
    colormapLabel?: LUT;
    anatomicalStructurePrimary: string;
};
type MGH = AnyNumberArray | {
    scalars: AnyNumberArray;
    colormapLabel: LUT;
};
type X3D = {
    positions: Float32Array;
    indices: Int32Array;
    rgba255: number[];
};

/** Enum for text alignment
 */
declare enum MeshType {
    MESH = "mesh",
    CONNECTOME = "connectome",
    FIBER = "fiber"
}
type NVMeshLayer = {
    name?: string;
    key?: string;
    url?: string;
    headers?: Record<string, string>;
    opacity: number;
    colormap: string;
    colormapNegative: string;
    colormapInvert: boolean;
    colormapLabel?: ColorMap | LUT;
    useNegativeCmap: boolean;
    global_min: number;
    global_max: number;
    cal_min: number;
    cal_max: number;
    cal_minNeg: number;
    cal_maxNeg: number;
    isAdditiveBlend: boolean;
    frame4D: number;
    nFrame4D: number;
    values: number[];
    outlineBorder?: number;
    isTransparentBelowCalMin?: boolean;
    alphaThreshold: boolean;
    base64?: string;
    colorbarVisible?: boolean;
};
declare class NVMeshFromUrlOptions {
    url: string;
    gl: WebGL2RenderingContext | null;
    name: string;
    opacity: number;
    rgba255: number[];
    visible: boolean;
    layers: NVMeshLayer[];
    colorbarVisible: boolean;
    constructor(url?: string, gl?: null, name?: string, opacity?: number, rgba255?: number[], visible?: boolean, layers?: never[], colorbarVisible?: boolean);
}
type BaseLoadParams = {
    gl: WebGL2RenderingContext;
    name: string;
    opacity: number;
    rgba255: number[];
    visible: boolean;
    layers: NVMeshLayer[];
};
type LoadFromUrlParams = Partial<BaseLoadParams> & {
    url: string;
    headers?: Record<string, string>;
};
type LoadFromFileParams = BaseLoadParams & {
    file: Blob;
};
type LoadFromBase64Params = BaseLoadParams & {
    base64: string;
};
/**
 * a NVMesh encapsulates some mesh data and provides methods to query and operate on meshes
 */
declare class NVMesh {
    id: string;
    name: string;
    anatomicalStructurePrimary: string;
    colorbarVisible: boolean;
    furthestVertexFromOrigin: number;
    extentsMin: number | number[];
    extentsMax: number | number[];
    opacity: number;
    visible: boolean;
    meshShaderIndex: number;
    offsetPt0: number[] | Uint32Array | null;
    colormapInvert: boolean;
    fiberGroupColormap: ColorMap | null;
    indexBuffer: WebGLBuffer;
    vertexBuffer: WebGLBuffer;
    vao: WebGLVertexArrayObject;
    vaoFiber: WebGLVertexArrayObject;
    pts: number[] | Float32Array;
    tris?: number[] | Uint32Array;
    layers: NVMeshLayer[];
    type: MeshType;
    data_type?: string;
    rgba255: number[];
    fiberLength?: number;
    fiberLengths?: number[];
    fiberDither: number;
    fiberColor: string;
    fiberDecimationStride: number;
    fiberSides: number;
    fiberRadius: number;
    f32PerVertex: number;
    fiberMask?: unknown[];
    colormap?: ColorMap | LegacyConnectome | string | null;
    dpg?: ValuesArray | null;
    dps?: ValuesArray | null;
    dpv?: ValuesArray | null;
    hasConnectome: boolean;
    connectome?: LegacyConnectome | string;
    indexCount?: number;
    vertexCount: number;
    nodeScale: number;
    edgeScale: number;
    nodeColormap: string;
    edgeColormap: string;
    nodeColormapNegative?: string;
    edgeColormapNegative?: string;
    nodeMinColor?: number;
    nodeMaxColor?: number;
    edgeMin?: number;
    edgeMax?: number;
    nodes?: LegacyNodes | NVConnectomeNode[];
    edges?: number[] | NVConnectomeEdge[];
    points?: Point[];
    /**
     * @param pts - a 3xN array of vertex positions (X,Y,Z coordinates).
     * @param tris - a 3xN array of triangle indices (I,J,K; indexed from zero). Each triangle generated from three vertices.
     * @param name - a name for this image. Default is an empty string
     * @param rgba255 - the base color of the mesh. RGBA values from 0 to 255. Default is white
     * @param opacity - the opacity for this mesh. default is 1
     * @param visible - whether or not this image is to be visible
     * @param gl - WebGL rendering context
     * @param connectome - specify connectome edges and nodes. Default is null (not a connectome).
     * @param dpg - Data per group for tractography, see TRK format. Default is null (not tractograpgy)
     * @param dps - Data per streamline for tractography, see TRK format.  Default is null (not tractograpgy)
     * @param dpv - Data per vertex for tractography, see TRK format.  Default is null (not tractograpgy)
     * @param colorbarVisible - does this mesh display a colorbar
     * @param anatomicalStructurePrimary - region for mesh. Default is an empty string
     */
    constructor(pts: number[] | Float32Array, tris: number[] | Uint32Array, name: string | undefined, rgba255: number[] | undefined, opacity: number | undefined, visible: boolean | undefined, gl: WebGL2RenderingContext, connectome?: LegacyConnectome | string | null, dpg?: ValuesArray | null, dps?: ValuesArray | null, dpv?: ValuesArray | null, colorbarVisible?: boolean, anatomicalStructurePrimary?: string);
    linesToCylinders(gl: WebGL2RenderingContext, posClrF32: Float32Array, indices: number[]): void;
    updateFibers(gl: WebGL2RenderingContext): void;
    updateConnectome(gl: WebGL2RenderingContext): void;
    indexNearestXYZmm(Xmm: number, Ymm: number, Zmm: number): number[];
    updateMesh(gl: WebGL2RenderingContext): void;
    reverseFaces(gl: WebGL2RenderingContext): void;
    setLayerProperty(id: number, key: keyof NVMeshLayer, val: number | string | boolean, gl: WebGL2RenderingContext): void;
    setProperty(key: keyof this, val: unknown, gl: WebGL2RenderingContext): void;
    generatePosNormClr(pts: number[] | Float32Array, tris: number[] | Uint32Array, rgba255: number[]): Float32Array;
    static loadConnectomeFromFreeSurfer(json: {
        points?: Point[];
        data_type: string;
    }, gl: WebGL2RenderingContext, name?: string, opacity?: number, visible?: boolean): NVMesh;
    static loadConnectomeFromJSON(json: Record<string, unknown>, gl: WebGL2RenderingContext, name?: string, opacity?: number, visible?: boolean): NVMesh;
    static readMesh(buffer: ArrayBuffer, name: string, gl: WebGL2RenderingContext, opacity?: number, rgba255?: number[], visible?: boolean): NVMesh;
    static loadLayer(layer: NVMeshLayer, nvmesh: NVMesh): Promise<void>;
    /**
     * factory function to load and return a new NVMesh instance from a given URL
     */
    static loadFromUrl({ url, headers, gl, name, opacity, rgba255, visible, layers }?: Partial<LoadFromUrlParams>): Promise<NVMesh>;
    static readFileAsync(file: Blob): Promise<ArrayBuffer>;
    /**
     * factory function to load and return a new NVMesh instance from a file in the browser
     *
     * @returns NVMesh instance
     */
    static loadFromFile({ file, gl, name, opacity, rgba255, visible, layers }?: Partial<LoadFromFileParams>): Promise<NVMesh>;
    /**
     * load and return a new NVMesh instance from a base64 encoded string
     */
    loadFromBase64({ base64, gl, name, opacity, rgba255, visible, layers }?: Partial<LoadFromBase64Params>): Promise<NVMesh>;
    static readGII(buffer: ArrayBuffer): GII;
    static readX3D(buffer: ArrayBuffer): X3D;
    static readNII(buffer: ArrayBuffer, n_vert?: number): Uint8Array | Float32Array | Int32Array | Int16Array;
    static readNII2(buffer: ArrayBuffer, n_vert?: number): Uint8Array | Float32Array | Int32Array | Int16Array;
    static readMGH(buffer: ArrayBuffer): MGH;
    static readSTL(buffer: ArrayBuffer): DefaultMeshType;
    static readTxtSTL(buffer: ArrayBuffer): DefaultMeshType;
    static readSRF(buffer: ArrayBuffer): DefaultMeshType;
    static readFreeSurfer(buffer: ArrayBuffer): DefaultMeshType;
    static readOBJ(buffer: ArrayBuffer): DefaultMeshType;
    static readOFF(buffer: ArrayBuffer): DefaultMeshType;
    static readGEO(buffer: ArrayBuffer, isFlipWinding?: boolean): DefaultMeshType;
    static readICO(buffer: ArrayBuffer): DefaultMeshType;
    static readPLY(buffer: ArrayBuffer): DefaultMeshType;
    static readMZ3(buffer: ArrayBuffer, n_vert?: number): MZ3;
    static readVTK(buffer: ArrayBuffer): VTK;
    static readASC(buffer: ArrayBuffer): DefaultMeshType;
    static readNV(buffer: ArrayBuffer): DefaultMeshType;
    static readANNOT(buffer: ArrayBuffer, n_vert: number, isReadColortables?: boolean): ANNOT;
    static readCURV(buffer: ArrayBuffer, n_vert: number): Float32Array;
    static readSTC(buffer: ArrayBuffer, n_vert: number): Float32Array;
    static readSMP(buffer: ArrayBuffer, n_vert: number): Float32Array;
    static readTxtVTK(buffer: ArrayBuffer): VTK;
    static readTRK(buffer: ArrayBuffer): TRK;
    static readTCK(buffer: ArrayBuffer): TCK;
    static readTSF(buffer: ArrayBuffer): Float32Array;
    static readTT(buffer: ArrayBuffer): TT;
    static readTRX(buffer: ArrayBuffer): TRX;
    static readTRACT(buffer: ArrayBuffer): TRACT;
}

/**
 * Enum for supported image types (e.g. NII, NRRD, DICOM)
 */
declare enum ImageType {
    UNKNOWN = 0,
    NII = 1,
    DCM = 2,
    DCM_MANIFEST = 3,
    MIH = 4,
    MIF = 5,
    NHDR = 6,
    NRRD = 7,
    MHD = 8,
    MHA = 9,
    MGH = 10,
    MGZ = 11,
    V = 12,
    V16 = 13,
    VMR = 14,
    HEAD = 15,
    DCM_FOLDER = 16
}
type ImageFromUrlOptions = {
    url: string;
    urlImageData?: string;
    headers?: Record<string, string>;
    name?: string;
    colorMap?: string;
    colormap?: string;
    opacity?: number;
    cal_min?: number;
    cal_max?: number;
    trustCalMinMax?: boolean;
    percentileFrac?: number;
    useQFormNotSForm?: boolean;
    alphaThreshold?: boolean;
    colormapNegative?: string;
    cal_minNeg?: number;
    cal_maxNeg?: number;
    colorbarVisible?: boolean;
    ignoreZeroVoxels?: boolean;
    imageType?: ImageType;
    frame4D?: number;
    colormapLabel?: string[];
    pairedImgData?: null;
    limitFrames4D?: number;
    isManifest?: boolean;
    urlImgData?: string;
};
type ImageFromFileOptions = {
    file: File | File[];
    name?: string;
    colormap?: string;
    opacity?: number;
    urlImgData?: File | null;
    cal_min?: number;
    cal_max?: number;
    trustCalMinMax?: boolean;
    percentileFrac?: number;
    ignoreZeroVoxels?: boolean;
    useQFormNotSForm?: boolean;
    colormapNegative?: string;
    imageType?: ImageType;
    frame4D?: number;
    limitFrames4D?: number;
};
type ImageFromBase64 = {
    base64: string;
    name?: string;
    colormap?: string;
    opacity?: number;
    cal_min?: number;
    cal_max?: number;
    trustCalMinMax?: boolean;
    percentileFrac?: number;
    ignoreZeroVoxels?: boolean;
};
type ImageMetadata = {
    id: string;
    datatypeCode: number;
    nx: number;
    ny: number;
    nz: number;
    nt: number;
    dx: number;
    dy: number;
    dz: number;
    dt: number;
    bpv: number;
};
declare const NVImageFromUrlOptions: (url: string, urlImageData?: string, name?: string, colormap?: string, opacity?: number, cal_min?: number, cal_max?: number, trustCalMinMax?: boolean, percentileFrac?: number, ignoreZeroVoxels?: boolean, useQFormNotSForm?: boolean, colormapNegative?: string, frame4D?: number, imageType?: ImageType, cal_minNeg?: number, cal_maxNeg?: number, colorbarVisible?: boolean, alphaThreshold?: boolean, colormapLabel?: string[]) => ImageFromUrlOptions;

/**
 * a NVImage encapsulates some images data and provides methods to query and operate on images
 */
declare class NVImage {
    name: string;
    id: string;
    url?: string;
    headers?: Record<string, string>;
    _colormap: string;
    _opacity: number;
    percentileFrac: number;
    ignoreZeroVoxels: boolean;
    trustCalMinMax: boolean;
    colormapNegative: string;
    colormapLabel: LUT | null;
    colormapInvert?: boolean;
    nFrame4D?: number;
    frame4D: number;
    nTotalFrame4D?: number;
    cal_minNeg: number;
    cal_maxNeg: number;
    colorbarVisible: boolean;
    modulationImage: number | null;
    modulateAlpha: number;
    series: any;
    nVox3D?: number;
    oblique_angle?: number;
    maxShearDeg?: number;
    useQFormNotSForm: boolean;
    alphaThreshold?: number;
    pixDims?: number[];
    matRAS?: mat4;
    pixDimsRAS?: number[];
    obliqueRAS?: mat4;
    dimsRAS?: number[];
    permRAS?: number[];
    toRAS?: mat4;
    toRASvox?: mat4;
    frac2mm?: mat4;
    frac2mmOrtho?: mat4;
    extentsMinOrtho?: number[];
    extentsMaxOrtho?: number[];
    mm2ortho?: mat4;
    hdr: nifti.NIFTI1 | nifti.NIFTI2 | null;
    imageType?: ImageType;
    img?: Uint8Array | Int16Array | Float32Array | Float64Array | Uint16Array;
    imaginary?: Float32Array;
    fileObject?: File | File[];
    dims?: number[];
    onColormapChange: (img: NVImage) => void;
    onOpacityChange: (img: NVImage) => void;
    mm000?: vec3;
    mm100?: vec3;
    mm010?: vec3;
    mm001?: vec3;
    cal_min?: number;
    cal_max?: number;
    robust_min?: number;
    robust_max?: number;
    global_min?: number;
    global_max?: number;
    urlImgData?: string;
    isManifest?: boolean;
    limitFrames4D?: number;
    DT_NONE: number;
    DT_UNKNOWN: number;
    DT_BINARY: number;
    DT_UNSIGNED_CHAR: number;
    DT_SIGNED_SHORT: number;
    DT_SIGNED_INT: number;
    DT_FLOAT: number;
    DT_COMPLEX: number;
    DT_DOUBLE: number;
    DT_RGB: number;
    DT_ALL: number;
    DT_INT8: number;
    DT_UINT16: number;
    DT_UINT32: number;
    DT_INT64: number;
    DT_UINT64: number;
    DT_FLOAT128: number;
    DT_COMPLEX128: number;
    DT_COMPLEX256: number;
    DT_RGBA32: number;
    /**
     *
     * @param dataBuffer - an array buffer of image data to load (there are also methods that abstract this more. See loadFromUrl, and loadFromFile)
     * @param name - a name for this image. Default is an empty string
     * @param colormap - a color map to use. default is gray
     * @param opacity - the opacity for this image. default is 1
     * @param pairedImgData - Allows loading formats where header and image are separate files (e.g. nifti.hdr, nifti.img)
     * @param cal_min - minimum intensity for color brightness/contrast
     * @param cal_max - maximum intensity for color brightness/contrast
     * @param trustCalMinMax - whether or not to trust cal_min and cal_max from the nifti header (trusting results in faster loading)
     * @param percentileFrac - the percentile to use for setting the robust range of the display values (smart intensity setting for images with large ranges)
     * @param ignoreZeroVoxels - whether or not to ignore zero voxels in setting the robust range of display values
     * @param useQFormNotSForm - give precedence to QForm (Quaternion) or SForm (Matrix)
     * @param colormapNegative - a color map to use for symmetrical negative intensities
     * @param frame4D - volume displayed, 0 indexed, must be less than nFrame4D
     *
     * FIXME the following params are documented but not included in the actual constructor
     * @param onColormapChange - callback for color map change
     * @param onOpacityChange -callback for color map change
     *
     * TODO the following parameters were not documented
     * @param imageType - TODO
     * @param cal_minNeg - TODO
     * @param cal_maxNeg - TODO
     * @param colorbarVisible - TODO
     * @param colormapLabel - TODO
     */
    constructor(dataBuffer?: ArrayBuffer | ArrayBuffer[] | null, name?: string, colormap?: string, opacity?: number, pairedImgData?: ArrayBuffer | null, cal_min?: number, cal_max?: number, trustCalMinMax?: boolean, percentileFrac?: number, ignoreZeroVoxels?: boolean, useQFormNotSForm?: boolean, colormapNegative?: string, frame4D?: number, imageType?: ImageType, cal_minNeg?: number, cal_maxNeg?: number, colorbarVisible?: boolean, colormapLabel?: LUT | null);
    computeObliqueAngle(mtx44: mat4): number;
    calculateOblique(): void;
    THD_daxes_to_NIFTI(xyzDelta: number[], xyzOrigin: number[], orientSpecific: number[]): void;
    SetPixDimFromSForm(): void;
    readDICOM(buf: ArrayBuffer | ArrayBuffer[]): ArrayBuffer;
    readECAT(buffer: ArrayBuffer): ArrayBuffer;
    readV16(buffer: ArrayBuffer): ArrayBuffer;
    readVMR(buffer: ArrayBuffer): ArrayBuffer;
    readMGH(buffer: ArrayBuffer): ArrayBuffer;
    readHEAD(dataBuffer: ArrayBuffer, pairedImgData: ArrayBuffer | null): ArrayBuffer;
    readMHA(buffer: ArrayBuffer, pairedImgData: ArrayBuffer | null): ArrayBuffer;
    readMIF(buffer: ArrayBuffer, pairedImgData: ArrayBuffer | null): ArrayBuffer;
    readNRRD(dataBuffer: ArrayBuffer, pairedImgData: ArrayBuffer | null): ArrayBuffer;
    calculateRAS(): void;
    img2RAS(): Float32Array | Uint8Array | Int16Array | Float64Array | Uint16Array;
    vox2mm(XYZ: number[], mtx: mat4): vec3;
    mm2vox(mm: number[], frac?: boolean): Float32Array | vec3;
    arrayEquals(a: unknown[], b: unknown[]): boolean;
    setColormap(cm: string): void;
    setColormapLabel(cm: ColorMap): void;
    setColormapLabelFromUrl(url: string): Promise<void>;
    get colormap(): string;
    get colorMap(): string;
    set colormap(cm: string);
    set colorMap(cm: string);
    get opacity(): number;
    set opacity(opacity: number);
    calMinMax(): number[];
    intensityRaw2Scaled(raw: number): number;
    intensityScaled2Raw(scaled: number): number;
    saveToUint8Array(fnm: string, drawing8?: Uint8Array | null): Uint8Array;
    saveToDisk(fnm?: string, drawing8?: Uint8Array | null): Uint8Array;
    static fetchDicomData(url: string, headers?: Record<string, string>): Promise<ArrayBuffer[]>;
    static fetchPartial(url: string, bytesToLoad: number, headers?: Record<string, string>): Promise<Response>;
    /**
     * factory function to load and return a new NVImage instance from a given URL
     * @returns  NVImage instance
     */
    static loadFromUrl({ url, urlImgData, headers, name, colormap, opacity, cal_min, cal_max, trustCalMinMax, percentileFrac, ignoreZeroVoxels, useQFormNotSForm, colormapNegative, frame4D, isManifest, limitFrames4D, imageType, colorbarVisible }?: Partial<Omit<ImageFromUrlOptions, 'url'>> & {
        url?: string | Uint8Array | ArrayBuffer;
    }): Promise<NVImage>;
    static readFileAsync(file: File, bytesToLoad?: number): Promise<ArrayBuffer>;
    /**
     * factory function to load and return a new NVImage instance from a file in the browser
     */
    static loadFromFile({ file, // file can be an array of file objects or a single file object
    name, colormap, opacity, urlImgData, cal_min, cal_max, trustCalMinMax, percentileFrac, ignoreZeroVoxels, useQFormNotSForm, colormapNegative, frame4D, limitFrames4D, imageType }: ImageFromFileOptions): Promise<NVImage>;
    /**
     * factory function to load and return a new NVImage instance from a base64 encoded string
     *
     * @returns NVImage instance
     * @example
     * myImage = NVImage.loadFromBase64('SomeBase64String')
     */
    static loadFromBase64({ base64, name, colormap, opacity, cal_min, cal_max, trustCalMinMax, percentileFrac, ignoreZeroVoxels }: ImageFromBase64): NVImage;
    /**
     * make a clone of a NVImage instance and return a new NVImage
     * @returns NVImage instance
     * @example
     * myImage = NVImage.loadFromFile(SomeFileObject) // files can be from dialogs or drag and drop
     * clonedImage = myImage.clone()
     */
    clone(): NVImage;
    /**
     * fill a NVImage instance with zeros for the image data
     * @example
     * myImage = NVImage.loadFromFile(SomeFileObject) // files can be from dialogs or drag and drop
     * clonedImageWithZeros = myImage.clone().zeroImage()
     */
    zeroImage(): void;
    /**
     * get nifti specific metadata about the image
     */
    getImageMetadata(): ImageMetadata;
    /**
     * a factory function to make a zero filled image given a NVImage as a reference
     * @param nvImage - an existing NVImage as a reference
     * @param dataType - the output data type. Options: 'same', 'uint8'
     * @returns new NVImage filled with zeros for the image data
     * @example
     * myImage = NVImage.loadFromFile(SomeFileObject) // files can be from dialogs or drag and drop
     * newZeroImage = NVImage.zerosLike(myImage)
     */
    static zerosLike(nvImage: NVImage, dataType?: string): NVImage;
    getValue(x: number, y: number, z: number, frame4D?: number, isReadImaginary?: boolean): number;
    /**
     * @param id - id of 3D Object (is this the base volume or an overlay?)
     * @param gl - WebGL rendering context
     * @returns new 3D object in model space
     */
    toNiivueObject3D(id: number, gl: WebGL2RenderingContext): NiivueObject3D;
    /**
     * Update options for image
     */
    applyOptionsUpdate(options: ImageFromUrlOptions): void;
    getImageOptions(): ImageFromUrlOptions;
    /**
     * Converts NVImage to NIfTI compliant byte array
     */
    toUint8Array(drawingBytes?: Uint8Array | null): Uint8Array;
    convertVox2Frac(vox: vec3): vec3;
    convertFrac2Vox(frac: vec3): vec3;
    convertFrac2MM(frac: vec3, isForceSliceMM?: boolean): vec4;
    convertMM2Frac(mm: vec3 | vec4, isForceSliceMM?: boolean): vec3;
}

type FreeSurferConnectome = {
    data_type: string;
    points: Array<{
        comments?: Array<{
            text: string;
        }>;
        coordinates: {
            x: number;
            y: number;
            z: number;
        };
    }>;
};
/**
 * Represents a connectome
 */
declare class NVConnectome extends NVMesh {
    gl: WebGL2RenderingContext;
    nodesChanged: EventTarget;
    legendLineThickness?: number;
    constructor(gl: WebGL2RenderingContext, connectome: LegacyConnectome);
    static convertLegacyConnectome(json: LegacyConnectome): Connectome;
    static convertFreeSurferConnectome(json: FreeSurferConnectome, colormap?: string): Connectome;
    updateLabels(): void;
    addConnectomeNode(node: NVConnectomeNode): void;
    deleteConnectomeNode(node: NVConnectomeNode): void;
    updateConnectomeNodeByIndex(index: number, updatedNode: NVConnectomeNode): void;
    updateConnectomeNodeByPoint(point: [number, number, number], updatedNode: NVConnectomeNode): void;
    addConnectomeEdge(first: number, second: number, colorValue: number): NVConnectomeEdge;
    deleteConnectomeEdge(first: number, second: number): NVConnectomeEdge;
    findClosestConnectomeNode(point: number[], distance: number): NVConnectomeNode | null;
    updateConnectome(gl: WebGL2RenderingContext): void;
    updateMesh(gl: WebGL2RenderingContext): void;
    json(): Connectome;
    /**
     * Factory method to create connectome from options
     */
    static loadConnectomeFromUrl(gl: WebGL2RenderingContext, url: string): Promise<NVConnectome>;
}

/**
 * Slice Type
 */
declare enum SLICE_TYPE {
    AXIAL = 0,
    CORONAL = 1,
    SAGITTAL = 2,
    MULTIPLANAR = 3,
    RENDER = 4
}
/**
 * Multi-planar layout
 */
declare enum MULTIPLANAR_TYPE {
    AUTO = 0,
    COLUMN = 1,
    GRID = 2,
    ROW = 3
}
declare enum DRAG_MODE {
    none = 0,
    contrast = 1,
    measurement = 2,
    pan = 3,
    slicer3D = 4,
    callbackOnly = 5
}
type NVConfigOptions = {
    textHeight: number;
    colorbarHeight: number;
    crosshairWidth: number;
    rulerWidth: number;
    show3Dcrosshair: boolean;
    backColor: number[];
    crosshairColor: number[];
    fontColor: number[];
    selectionBoxColor: number[];
    clipPlaneColor: number[];
    rulerColor: number[];
    colorbarMargin: number;
    trustCalMinMax: boolean;
    clipPlaneHotKey: string;
    viewModeHotKey: string;
    doubleTouchTimeout: number;
    longTouchTimeout: number;
    keyDebounceTime: number;
    isNearestInterpolation: boolean;
    atlasOutline: number;
    isRuler: boolean;
    isColorbar: boolean;
    isOrientCube: boolean;
    multiplanarPadPixels: number;
    multiplanarForceRender: boolean;
    isRadiologicalConvention: boolean;
    meshThicknessOn2D: number | string;
    dragMode: DRAG_MODE;
    yoke3Dto2DZoom: boolean;
    isDepthPickMesh: boolean;
    isCornerOrientationText: boolean;
    sagittalNoseLeft: boolean;
    isSliceMM: boolean;
    isV1SliceShader: boolean;
    isHighResolutionCapable: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent';
    loadingText: string;
    isForceMouseClickToVoxelCenters: boolean;
    dragAndDropEnabled: boolean;
    drawingEnabled: boolean;
    penValue: number;
    floodFillNeighbors: number;
    isFilledPen: boolean;
    thumbnail: string;
    maxDrawUndoBitmaps: number;
    sliceType: SLICE_TYPE;
    isAntiAlias: boolean | null;
    isAdditiveBlend: boolean;
    isResizeCanvas: boolean;
    meshXRay: number;
    limitFrames4D: number;
    showLegend: boolean;
    legendBackgroundColor: number[];
    legendTextColor: number[];
    multiplanarLayout: MULTIPLANAR_TYPE;
    renderOverlayBlend: number;
};
declare const DEFAULT_OPTIONS: NVConfigOptions;
type SceneData = {
    azimuth: number;
    elevation: number;
    crosshairPos: vec3;
    clipPlane: number[];
    clipPlaneDepthAziElev: number[];
    volScaleMultiplier: number;
    pan2Dxyzmm: vec4;
};
type Scene = {
    onAzimuthElevationChange: (azimuth: number, elevation: number) => void;
    onZoom3DChange: (scale: number) => void;
    sceneData: SceneData;
    renderAzimuth: number;
    renderElevation: number;
    volScaleMultiplier: number;
    crosshairPos: vec3;
    clipPlane: number[];
    clipPlaneDepthAziElev: number[];
    pan2Dxyzmm: vec4;
    _elevation?: number;
    _azimuth?: number;
};
type DocumentData = {
    title: string;
    imageOptionsArray: ImageFromUrlOptions[];
    meshOptionsArray: unknown[];
    opts: NVConfigOptions;
    previewImageDataURL: string;
    labels: NVLabel3D[];
    encodedImageBlobs: string[];
    encodedDrawingBlob: string;
    meshesString?: string;
    sceneData?: SceneData;
    connectomes?: string[];
};
type ExportDocumentData = {
    encodedImageBlobs: string[];
    encodedDrawingBlob: string;
    previewImageDataURL: string;
    imageOptionsMap: Map<string, number>;
    imageOptionsArray: ImageFromUrlOptions[];
    sceneData: Partial<SceneData>;
    opts: NVConfigOptions;
    meshesString: string;
    labels: NVLabel3D[];
    connectomes: string[];
};
/**
 * Creates and instance of NVDocument
 */
declare class NVDocument {
    data: DocumentData;
    scene: Scene;
    volumes: NVImage[];
    meshDataObjects?: Array<NVMesh | NVConnectome>;
    meshes: Array<NVMesh | NVConnectome>;
    drawBitmap: Uint8Array | null;
    imageOptionsMap: Map<any, any>;
    meshOptionsMap: Map<any, any>;
    constructor();
    /**
     * Title of the document
     */
    get title(): string;
    /**
     * Gets preview image blob
     * @returns dataURL of preview image
     */
    get previewImageDataURL(): string;
    /**
     * Sets preview image blob
     * @param dataURL - encoded preview image
     */
    set previewImageDataURL(dataURL: string);
    /**
     * @param title - title of document
     */
    set title(title: string);
    get imageOptionsArray(): ImageFromUrlOptions[];
    /**
     * Gets the base 64 encoded blobs of associated images
     */
    get encodedImageBlobs(): string[];
    /**
     * Gets the base 64 encoded blob of the associated drawing
     * TODO the return type was marked as string[] here, was that an error?
     */
    get encodedDrawingBlob(): string;
    /**
     * Gets the options of the {@link Niivue} instance
     */
    get opts(): NVConfigOptions;
    /**
     * Sets the options of the {@link Niivue} instance
     */
    set opts(opts: NVConfigOptions);
    /**
     * Gets the 3D labels of the {@link Niivue} instance
     */
    get labels(): NVLabel3D[];
    /**
     * Sets the 3D labels of the {@link Niivue} instance
     */
    set labels(labels: NVLabel3D[]);
    /**
     * Checks if document has an image by id
     */
    hasImage(image: NVImage): boolean;
    /**
     * Checks if document has an image by url
     */
    hasImageFromUrl(url: string): boolean;
    /**
     * Adds an image and the options an image was created with
     */
    addImageOptions(image: NVImage, imageOptions: ImageFromUrlOptions): void;
    /**
     * Removes image from the document as well as its options
     */
    removeImage(image: NVImage): void;
    /**
     * Returns the options for the image if it was added by url
     */
    getImageOptions(image: NVImage): ImageFromUrlOptions | null;
    /**
     * Converts NVDocument to JSON
     */
    json(): ExportDocumentData;
    /**
     * Downloads a JSON file with options, scene, images, meshes and drawing of {@link Niivue} instance
     */
    download(fileName: string): void;
    /**
     * Deserialize mesh data objects
     */
    static deserializeMeshDataObjects(document: NVDocument): void;
    /**
     * Factory method to return an instance of NVDocument from a URL
     */
    static loadFromUrl(url: string): Promise<NVDocument>;
    /**
     * Factory method to return an instance of NVDocument from a File object
     */
    static loadFromFile(file: Blob): Promise<NVDocument>;
    /**
     * Factory method to return an instance of NVDocument from JSON
     */
    static loadFromJSON(data: DocumentData): NVDocument;
}

/**
 * Enum for sync operations
 */
declare enum NVMESSAGE {
    ZOOM = 1,// "zoom",
    CLIP_PLANE = 2,// "clipPlane",
    AZIMUTH_ELEVATION = 3,// "ae",
    FRAME_CHANGED = 4,// "frame changed",
    VOLUME_ADDED_FROM_URL = 5,// "volume added from url",
    VOLUME_WITH_URL_REMOVED = 6,// "volume with url removed",
    COLORMAP_CHANGED = 7,// "color map has changed",
    OPACITY_CHANGED = 8,// "opacity has changed",
    MESH_FROM_URL_ADDED = 9,// "mesh added from url",
    MESH_WITH_URL_REMOVED = 10,// "mesh with url removed",
    CUSTOM_SHADER_ADDED = 11,// "custom shader added",
    SHADER_CHANGED = 12,// "mesh shader changed",
    MESH_PROPERTY_CHANGED = 13,// "mesh property changed",
    USER_JOINED = "user joined",// TODO this breaks the scheme a bit -- see session-bus::localStorageEventListener
    CREATE = "create",// TODO same as above
    VOLUME_LOADED_FROM_URL = "volume with url added"
}
type Message = {
    userKey?: string;
    from?: string;
} & ({
    op: NVMESSAGE.ZOOM;
    zoom: number;
} | {
    op: NVMESSAGE.CLIP_PLANE;
    clipPlane: number[];
} | {
    op: NVMESSAGE.AZIMUTH_ELEVATION;
    elevation: number;
    azimuth: number;
} | {
    op: NVMESSAGE.FRAME_CHANGED;
    url: string;
    index: number;
} | {
    op: NVMESSAGE.VOLUME_ADDED_FROM_URL;
    imageOptions: any;
} | {
    op: NVMESSAGE.VOLUME_LOADED_FROM_URL;
    url: string;
} | {
    op: NVMESSAGE.VOLUME_WITH_URL_REMOVED;
    url: string;
} | {
    op: NVMESSAGE.COLORMAP_CHANGED;
    url: string;
    colormap: string;
} | {
    op: NVMESSAGE.OPACITY_CHANGED;
    url: string;
    opacity: number;
} | {
    op: NVMESSAGE.MESH_FROM_URL_ADDED;
    meshOptions: LoadFromUrlParams;
} | {
    op: NVMESSAGE.MESH_WITH_URL_REMOVED;
    url: string;
} | {
    op: NVMESSAGE.CUSTOM_SHADER_ADDED;
    fragmentShaderText: string;
    name: string;
} | {
    op: NVMESSAGE.SHADER_CHANGED;
    meshIndex: number;
    shaderIndex: number;
} | {
    op: NVMESSAGE.MESH_PROPERTY_CHANGED;
    meshIndex: number;
    key: string;
    val: unknown;
} | {
    op: NVMESSAGE.USER_JOINED;
    user: SessionUser;
} | {
    op: NVMESSAGE.CREATE;
    key: string;
});

/**
 * SessionUser specifies display name, user id and user key
 * @param userKey - Used to protect user properties
 */
declare class SessionUser {
    id: string;
    displayName: string;
    key: string;
    properties: Map<string, string>;
    constructor(displayName?: string, userId?: string, userKey?: string, userProperties?: Map<string, string>);
}
/**
 * SessionBus is for synchronizing both remote and local instances
 */
declare class SessionBus {
    userList: SessionUser[];
    user: SessionUser;
    userQueueName?: string;
    userListName?: string;
    onMessageCallback: (newMessage: Message) => void;
    isConnectedToServer: boolean;
    isController: boolean;
    sessionScene: {};
    sessionKey: string;
    sessionName: string;
    sessionSceneName: string;
    serverConnection$: WebSocketSubject<Message> | null;
    constructor(name: string, user: SessionUser, onMessageCallback: (newMessage: Message) => void, serverURL?: string, sessionKey?: string);
    sendSessionMessage(message: Message): void;
    connectToServer(serverURL: string, sessionName: string): void;
    subscribeToServer(): void;
    sendLocalMessage(message: Message): void;
    localStorageEventListener(e: StorageEvent): void;
}

/**
 * NVController is for synchronizing both remote and local instances of Niivue
 */
declare class NVController {
    niivue: Niivue;
    mediaUrlMap: Map<string, unknown>;
    isInSession: boolean;
    user?: SessionUser;
    sessionBus?: SessionBus;
    onFrameChange: (_volume: NVImage, _index: number) => void;
    /**
     * @param niivue - niivue object to control
     */
    constructor(niivue: Niivue);
    onLocationChangeHandler(location: unknown): void;
    addVolume(volume: NVImage, url: string): void;
    addMesh(mesh: NVMesh, url: string): void;
    onNewMessage(msg: Message): void;
    /**
     * Connects to existing session or creates new session
     */
    connectToSession(sessionName: string, user?: SessionUser, serverBaseUrl?: string, sessionKey?: string): void;
    /**
     * Zoom level has changed
     */
    onZoom3DChangeHandler(zoom: number): void;
    /**
     * Azimuth and/or elevation has changed
     */
    onAzimuthElevationChangeHandler(azimuth: number, elevation: number): void;
    /**
     * Clip plane has changed
     */
    onClipPlaneChangeHandler(clipPlane: number[]): void;
    /**
     * Add an image and notify subscribers
     */
    onVolumeAddedFromUrlHandler(imageOptions: ImageFromUrlOptions, volume: NVImage): void;
    /**
     * A volume has been added
     */
    onImageLoadedHandler(volume: NVImage): void;
    /**
     * Notifies other users that a volume has been removed
     */
    onVolumeWithUrlRemovedHandler(url: string): void;
    /**
     * Notifies that a mesh has been loaded by URL
     */
    onMeshAddedFromUrlHandler(meshOptions: LoadFromUrlParams): void;
    /**
     * Notifies that a mesh has been added
     */
    onMeshLoadedHandler(mesh: NVMesh): void;
    onMeshWithUrlRemovedHandler(url: string): void;
    /**
     *
     * @param volume - volume that has changed color maps
     */
    onColormapChangeHandler(volume: NVImage): void;
    /**
     * @param volume - volume that has changed opacity
     */
    onOpacityChangeHandler(volume: NVImage): void;
    /**
     * Frame for 4D image has changed
     */
    onFrameChangeHandler(volume: NVImage, index: number): void;
    /**
     * Custom mesh shader has been added
     * @param fragmentShaderText - shader code to be compiled
     * @param name - name of shader, can be used as index
     */
    onCustomMeshShaderAddedHandler(fragmentShaderText: string, name: string): void;
    /**
     * Mesh shader has changed
     * @param meshIndex - index of mesh
     * @param shaderIndex - index of shader
     */
    onMeshShaderChanged(meshIndex: number, shaderIndex: number): void;
    /**
     * Mesh property has been changed
     * @param meshIndex - index of mesh
     * @param key - property index
     * @param val - property value
     */
    onMeshPropertyChanged(meshIndex: number, key: string, val: unknown): void;
}

/**
 * Namespace for utility functions
 */
declare class NVUtilities {
    static arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
    static uint8tob64(bytes: Uint8Array): string;
    static download(content: string, fileName: string, contentType: string): void;
    static readFileAsync(file: Blob): Promise<ArrayBuffer>;
    static blobToBase64(blob: Blob): Promise<string>;
    static decompressBase64String(base64: string): string;
    static compressToBase64String(string: string): string;
    static arraysAreEqual(a: unknown[], b: unknown[]): boolean;
    /**
     * Generate a pre-filled number array.
     *
     * @param start - start value
     * @param stop - stop value
     * @param step - step value
     * @returns filled number array
     */
    static range(start: number, stop: number, step: number): number[];
    /**
     * convert spherical AZIMUTH, ELEVATION to Cartesian
     * @param azimuth - azimuth number
     * @param elevation - elevation number
     * @returns the converted [x, y, z] coordinates
     * @example
     * xyz = NVUtilities.sph2cartDeg(42, 42)
     */
    static sph2cartDeg(azimuth: number, elevation: number): number[];
    static vox2mm(XYZ: number[], mtx: mat4): vec3;
}

/**
 * Class to load different mesh formats
 */
declare class NVMeshLoaders {
    static readTRACT(buffer: ArrayBuffer): TRACT;
    static readTT(buffer: ArrayBuffer): TT;
    static readTRX(buffer: ArrayBuffer): TRX;
    static readTSF(buffer: ArrayBuffer, n_vert?: number): Float32Array;
    static readTCK(buffer: ArrayBuffer): TCK;
    static readTRK(buffer: ArrayBuffer): TRK;
    static readTxtVTK(buffer: ArrayBuffer): VTK;
    static readLayer(name: string | undefined, buffer: ArrayBuffer, nvmesh: NVMesh, opacity?: number, colormap?: string, colormapNegative?: string, useNegativeCmap?: boolean, cal_min?: number | null, cal_max?: number | null, outlineBorder?: number): void;
    static readSMP(buffer: ArrayBuffer, n_vert: number): Float32Array;
    static readSTC(buffer: ArrayBuffer, n_vert: number): Float32Array;
    static readCURV(buffer: ArrayBuffer, n_vert: number): Float32Array;
    static readANNOT(buffer: ArrayBuffer, n_vert: number, isReadColortables?: boolean): ANNOT;
    static readNV(buffer: ArrayBuffer): DefaultMeshType;
    static readASC(buffer: ArrayBuffer): DefaultMeshType;
    static readVTK(buffer: ArrayBuffer): VTK;
    static readDFS(buffer: ArrayBuffer): DefaultMeshType;
    static readMZ3(buffer: ArrayBuffer, n_vert?: number): MZ3;
    static readPLY(buffer: ArrayBuffer): DefaultMeshType;
    static readICO(buffer: ArrayBuffer): DefaultMeshType;
    static readGEO(buffer: ArrayBuffer, isFlipWinding?: boolean): DefaultMeshType;
    static readOFF(buffer: ArrayBuffer): DefaultMeshType;
    static readOBJMNI(buffer: ArrayBuffer): DefaultMeshType;
    static readOBJ(buffer: ArrayBuffer): DefaultMeshType;
    static readFreeSurfer(buffer: ArrayBuffer): DefaultMeshType;
    static readSRF(buffer: ArrayBuffer): DefaultMeshType;
    static readTxtSTL(buffer: ArrayBuffer): DefaultMeshType;
    static readSTL(buffer: ArrayBuffer): DefaultMeshType;
    static readNII2(buffer: ArrayBuffer, n_vert?: number, anatomicalStructurePrimary?: string): Int32Array | Float32Array | Int16Array | Uint8Array;
    static readNII(buffer: ArrayBuffer, n_vert?: number, anatomicalStructurePrimary?: string): Float32Array | Uint8Array | Int32Array | Int16Array;
    static readMGH(buffer: ArrayBuffer, n_vert?: number, isReadColortables?: boolean): MGH;
    static readX3D(buffer: ArrayBuffer): X3D;
    static readGII(buffer: ArrayBuffer, n_vert?: number): GII;
}

type DragReleaseParams = {
    fracStart: vec3;
    fracEnd: vec3;
    voxStart: vec3;
    voxEnd: vec3;
    mmStart: vec4;
    mmEnd: vec4;
    mmLength: number;
    tileIdx: number;
    axCorSag: SLICE_TYPE;
};
type ColormapListEntry = {
    name: string;
    min: number;
    max: number;
    alphaThreshold: boolean;
    negative: boolean;
    visible: boolean;
    invert: boolean;
};
type Graph = {
    LTWH: number[];
    plotLTWH?: number[];
    opacity: number;
    vols: number[];
    autoSizeMultiplanar: boolean;
    normalizeValues: boolean;
    backColor?: number[];
    lineColor?: number[];
    textColor?: number[];
    lineThickness?: number;
    lineAlpha?: number;
    lines?: number[][];
    selectedColumn?: number;
    lineRGB?: number[][];
};
type Descriptive = {
    mean: number;
    stdev: number;
    nvox: number;
    volumeMM3: number;
    volumeML: number;
    min: number;
    max: number;
    meanNot0: number;
    stdevNot0: number;
    nvoxNot0: number;
    minNot0: number;
    maxNot0: number;
    cal_min: number;
    cal_max: number;
    robust_min: number;
    robust_max: number;
};
type SliceScale = {
    volScale: number[];
    vox: number[];
    longestAxis: number;
    dimsMM: vec3;
};
type MvpMatrix2D = {
    modelViewProjectionMatrix: mat4;
    modelMatrix: mat4;
    normalMatrix: mat4;
    leftTopMM: number[];
    fovMM: number[];
};
type MM = {
    mnMM: vec3;
    mxMM: vec3;
    rotation: mat4;
    fovMM: vec3;
};
/**
 * Niivue exposes many properties. It's always good to call `updateGLVolume` after altering one of these settings.
 */
type NiiVueOptions = {
    textHeight?: number;
    colorbarHeight?: number;
    colorbarMargin?: number;
    crosshairWidth?: number;
    rulerWidth?: number;
    backColor?: number[];
    crosshairColor?: number[];
    fontColor?: number[];
    selectionBoxColor?: number[];
    clipPlaneColor?: number[];
    rulerColor?: number[];
    show3Dcrosshair?: boolean;
    trustCalMinMax?: boolean;
    clipPlaneHotKey?: string;
    viewModeHotKey?: string;
    keyDebounceTime?: number;
    doubleTouchTimeout?: number;
    longTouchTimeout?: number;
    isRadiologicalConvention?: boolean;
    logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent';
    loadingText?: string;
    dragAndDropEnabled?: boolean;
    isNearestInterpolation?: boolean;
    atlasOutline?: number;
    isRuler?: boolean;
    isColorbar?: boolean;
    isOrientCube?: boolean;
    multiplanarPadPixels?: number;
    multiplanarForceRender?: boolean;
    meshThicknessOn2D?: number;
    dragMode?: DRAG_MODE;
    isDepthPickMesh?: boolean;
    isCornerOrientationText?: boolean;
    sagittalNoseLeft?: boolean;
    isSliceMM?: boolean;
    isV1SliceShader?: boolean;
    isHighResolutionCapable?: boolean;
    isForceMouseClickToVoxelCenters?: boolean;
    drawingEnabled?: boolean;
    penValue?: number;
    floodFillNeighbors?: number;
    maxDrawUndoBitmaps?: number;
    thumbnail?: string;
    meshXRay?: number;
};
type UIData = {
    mousedown: boolean;
    touchdown: boolean;
    mouseButtonLeftDown: boolean;
    mouseButtonCenterDown: boolean;
    mouseButtonRightDown: boolean;
    mouseDepthPicker: boolean;
    clickedTile: number;
    pan2DxyzmmAtMouseDown: vec4;
    prevX: number;
    prevY: number;
    currX: number;
    currY: number;
    currentTouchTime: number;
    lastTouchTime: number;
    touchTimer: NodeJS.Timeout | null;
    doubleTouch: boolean;
    isDragging: boolean;
    dragStart: number[];
    dragEnd: number[];
    dragClipPlaneStartDepthAziElev: number[];
    lastTwoTouchDistance: number;
    multiTouchGesture: boolean;
    loading$: Subject<unknown>;
    dpr?: number;
};
type SaveImageOptions = {
    filename: string;
    isSaveDrawing: boolean;
    volumeByIndex: number;
};
/**
 * Niivue can be attached to a canvas. An instance of Niivue contains methods for
 * loading and rendering NIFTI image data in a WebGL 2.0 context.
 *
 * @example
 * let niivue = new Niivue(\{crosshairColor: [0,1,0,0.5], textHeight: 0.5\}) // a see-through green crosshair, and larger text labels
 */
declare class Niivue {
    canvas: HTMLCanvasElement | null;
    _gl: WebGL2RenderingContext | null;
    isBusy: boolean;
    needsRefresh: boolean;
    colormapTexture: WebGLTexture | null;
    colormapLists: ColormapListEntry[];
    volumeTexture: WebGLTexture | null;
    gradientTexture: WebGLTexture | null;
    gradientTextureAmount: number;
    drawTexture: WebGLTexture | null;
    drawUndoBitmaps: Uint8Array[];
    drawLut: LUT;
    drawOpacity: number;
    renderDrawAmbientOcclusion: number;
    colorbarHeight: number;
    drawPenLocation: number[];
    drawPenAxCorSag: number;
    drawFillOverwrites: boolean;
    drawPenFillPts: number[][];
    overlayTexture: WebGLTexture | null;
    overlayTextureID: WebGLTexture | null;
    sliceMMShader?: Shader;
    sliceV1Shader?: Shader;
    orientCubeShader?: Shader;
    orientCubeShaderVAO: WebGLVertexArrayObject | null;
    rectShader?: Shader;
    renderShader?: Shader;
    lineShader?: Shader;
    line3DShader?: Shader;
    passThroughShader?: Shader;
    renderGradientShader?: Shader;
    renderSliceShader?: Shader;
    renderVolumeShader?: Shader;
    pickingMeshShader?: Shader;
    pickingImageShader?: Shader;
    colorbarShader?: Shader;
    fontShader: Shader | null;
    fiberShader?: Shader;
    fontTexture: WebGLTexture | null;
    circleShader?: Shader;
    matCapTexture: WebGLTexture | null;
    bmpShader: Shader | null;
    bmpTexture: WebGLTexture | null;
    thumbnailVisible: boolean;
    bmpTextureWH: number;
    growCutShader?: Shader;
    orientShaderAtlasU: Shader | null;
    orientShaderAtlasI: Shader | null;
    orientShaderU: Shader | null;
    orientShaderI: Shader | null;
    orientShaderF: Shader | null;
    orientShaderRGBU: Shader | null;
    surfaceShader: Shader | null;
    blurShader: Shader | null;
    sobelShader: Shader | null;
    genericVAO: WebGLVertexArrayObject | null;
    unusedVAO: null;
    crosshairs3D: NiivueObject3D | null;
    private DEFAULT_FONT_GLYPH_SHEET;
    private DEFAULT_FONT_METRICS;
    private fontMetrics?;
    private fontMets;
    backgroundMasksOverlays: number;
    overlayOutlineWidth: number;
    overlayAlphaShader: number;
    isAlphaClipDark: boolean;
    position?: vec3;
    extentsMin?: vec3;
    extentsMax?: vec3;
    private resizeObserver;
    syncOpts: Record<string, unknown>;
    readyForSync: boolean;
    uiData: UIData;
    eventsToSubjects: Record<string, Subject<unknown>>;
    back: NVImage | null;
    overlays: NVImage[];
    deferredVolumes: ImageFromUrlOptions[];
    deferredMeshes: LoadFromUrlParams[];
    furthestVertexFromOrigin: number;
    volScale: number[];
    vox: number[];
    mousePos: number[];
    screenSlices: Array<{
        leftTopWidthHeight: number[];
        axCorSag: SLICE_TYPE;
        sliceFrac: number;
        AxyzMxy: number[];
        leftTopMM: number[];
        fovMM: number[];
        screen2frac?: number[];
    }>;
    cuboidVertexBuffer?: WebGLBuffer;
    otherNV: Niivue | Niivue[] | null;
    volumeObject3D: NiivueObject3D | null;
    pivot3D: number[];
    furthestFromPivot: number;
    currentClipPlaneIndex: number;
    lastCalled: number;
    selectedObjectId: number;
    CLIP_PLANE_ID: number;
    VOLUME_ID: number;
    DISTANCE_FROM_CAMERA: number;
    graph: Graph;
    meshShaders: Array<{
        Name: string;
        Frag: string;
        shader?: Shader;
    }>;
    dragModes: {
        contrast: DRAG_MODE;
        measurement: DRAG_MODE;
        none: DRAG_MODE;
        pan: DRAG_MODE;
        slicer3D: DRAG_MODE;
        callbackOnly: DRAG_MODE;
    };
    sliceTypeAxial: SLICE_TYPE;
    sliceTypeCoronal: SLICE_TYPE;
    sliceTypeSagittal: SLICE_TYPE;
    sliceTypeMultiplanar: SLICE_TYPE;
    sliceTypeRender: SLICE_TYPE;
    sliceMosaicString: string;
    /**
     * callback function to run when the right mouse button is released after dragging
     * @example
     * niivue.onDragRelease = () =\> \{
     *   console.log('drag ended')
     * \}
     */
    onDragRelease: (params: DragReleaseParams) => void;
    /**
     * callback function to run when the left mouse button is released
     * @example
     * niivue.onMouseUp = () =\> \{
     *   console.log('mouse up')
     * \}
     */
    onMouseUp: (data: Partial<UIData>) => void;
    /**
     * callback function to run when the crosshair location changes
     * @example
     * niivue.onLocationChange = (data) =\> \{
     * console.log('location changed')
     * console.log('mm: ', data.mm)
     * console.log('vox: ', data.vox)
     * console.log('frac: ', data.frac)
     * console.log('values: ', data.values)
     * \}
     */
    onLocationChange: (location: unknown) => void;
    /**
     * callback function to run when the user changes the intensity range with the selection box action (right click)
     * @example
     * niivue.onIntensityChange = (volume) =\> \{
     * console.log('intensity changed')
     * console.log('volume: ', volume)
     * \}
     */
    onIntensityChange: (volume: NVImage) => void;
    /**
     * callback function to run when a new volume is loaded
     * @example
     * niivue.onImageLoaded = (volume) =\> \{
     * console.log('volume loaded')
     * console.log('volume: ', volume)
     * \}
     */
    onImageLoaded: (volume: NVImage) => void;
    /**
     * callback function to run when a new mesh is loaded
     * @example
     * niivue.onMeshLoaded = (mesh) =\> \{
     * console.log('mesh loaded')
     * console.log('mesh: ', mesh)
     * \}
     */
    onMeshLoaded: (mesh: NVMesh) => void;
    /**
     * callback function to run when the user changes the volume when a 4D image is loaded
     * @example
     * niivue.onFrameChange = (volume, frameNumber) =\> \{
     * console.log('frame changed')
     * console.log('volume: ', volume)
     * console.log('frameNumber: ', frameNumber)
     * \}
     */
    onFrameChange: (volume: NVImage, index: number) => void;
    /**
     * callback function to run when niivue reports an error
     * @example
     * niivue.onError = (error) =\> \{
     * console.log('error: ', error)
     * \}
     */
    onError: () => void;
    onColormapChange: () => void;
    /**
     * callback function to run when niivue reports detailed info
     * @example
     * niivue.onInfo = (info) =\> \{
     * console.log('info: ', info)
     * \}
     */
    onInfo: () => void;
    /**
     * callback function to run when niivue reports a warning
     * @example
     * niivue.onWarn = (warn) =\> \{
     * console.log('warn: ', warn)
     * \}
     */
    onWarn: () => void;
    /**
     * callback function to run when niivue reports a debug message
     * @example
     * niivue.onDebug = (debug) =\> \{
     * console.log('debug: ', debug)
     * \}
     */
    onDebug: () => void;
    /**
     * callback function to run when a volume is added from a url
     * @example
     * niivue.onVolumeAddedFromUrl = (imageOptions, volume) =\> \{
     * console.log('volume added from url')
     * console.log('imageOptions: ', imageOptions)
     * console.log('volume: ', volume)
     * \}
     */
    onVolumeAddedFromUrl: (imageOptions: ImageFromUrlOptions, volume: NVImage) => void;
    onVolumeWithUrlRemoved: (url: string) => void;
    /**
     * callback function to run when updateGLVolume is called (most users will not need to use
     * @example
     * niivue.onVolumeUpdated = () =\> \{
     * console.log('volume updated')
     * \}
     */
    onVolumeUpdated: () => void;
    /**
     * callback function to run when a mesh is added from a url
     * @example
     * niivue.onMeshAddedFromUrl = (meshOptions, mesh) =\> \{
     * console.log('mesh added from url')
     * console.log('meshOptions: ', meshOptions)
     * console.log('mesh: ', mesh)
     * \}
     */
    onMeshAddedFromUrl: (meshOptions: LoadFromUrlParams, mesh: NVMesh) => void;
    onMeshAdded: () => void;
    onMeshWithUrlRemoved: (url: string) => void;
    onZoom3DChange: (zoom: number) => void;
    /**
     * callback function to run when the user changes the rotation of the 3D rendering
     * @example
     * niivue.onAzimuthElevationChange = (azimuth, elevation) =\> \{
     * console.log('azimuth: ', azimuth)
     * console.log('elevation: ', elevation)
     * \}
     */
    onAzimuthElevationChange: (azimuth: number, elevation: number) => void;
    /**
     * callback function to run when the user changes the clip plane
     * @example
     * niivue.onClipPlaneChange = (clipPlane) =\> \{
     * console.log('clipPlane: ', clipPlane)
     * \}
     */
    onClipPlaneChange: (clipPlane: number[]) => void;
    onCustomMeshShaderAdded: (fragmentShaderText: string, name: string) => void;
    onMeshShaderChanged: (meshIndex: number, shaderIndex: number) => void;
    onMeshPropertyChanged: (meshIndex: number, key: string, val: unknown) => void;
    /**
     * callback function to run when the user loads a new NiiVue document
     * @example
     * niivue.onDocumentLoaded = (document) =\> \{
     * console.log('document: ', document)
     * \}
     */
    onDocumentLoaded: (document: NVDocument) => void;
    document: NVDocument;
    opts: {
        textHeight: number;
        colorbarHeight: number;
        crosshairWidth: number;
        rulerWidth: number;
        show3Dcrosshair: boolean;
        backColor: number[];
        crosshairColor: number[];
        fontColor: number[];
        selectionBoxColor: number[];
        clipPlaneColor: number[];
        rulerColor: number[];
        colorbarMargin: number;
        trustCalMinMax: boolean;
        clipPlaneHotKey: string;
        viewModeHotKey: string;
        doubleTouchTimeout: number;
        longTouchTimeout: number;
        keyDebounceTime: number;
        isNearestInterpolation: boolean;
        atlasOutline: number;
        isRuler: boolean;
        isColorbar: boolean;
        isOrientCube: boolean;
        multiplanarPadPixels: number;
        multiplanarForceRender: boolean;
        isRadiologicalConvention: boolean;
        meshThicknessOn2D: string | number;
        dragMode: DRAG_MODE;
        yoke3Dto2DZoom: boolean;
        isDepthPickMesh: boolean;
        isCornerOrientationText: boolean;
        sagittalNoseLeft: boolean;
        isSliceMM: boolean;
        isV1SliceShader: boolean;
        isHighResolutionCapable: boolean;
        logLevel: "debug" | "info" | "warn" | "error" | "fatal" | "silent";
        loadingText: string;
        isForceMouseClickToVoxelCenters: boolean;
        dragAndDropEnabled: boolean;
        drawingEnabled: boolean;
        penValue: number;
        floodFillNeighbors: number;
        isFilledPen: boolean;
        thumbnail: string;
        maxDrawUndoBitmaps: number;
        sliceType: SLICE_TYPE;
        isAntiAlias: boolean | null;
        isAdditiveBlend: boolean;
        isResizeCanvas: boolean;
        meshXRay: number;
        limitFrames4D: number;
        showLegend: boolean;
        legendBackgroundColor: number[];
        legendTextColor: number[];
        multiplanarLayout: MULTIPLANAR_TYPE;
        renderOverlayBlend: number;
    };
    scene: {
        onAzimuthElevationChange: (azimuth: number, elevation: number) => void;
        onZoom3DChange: (scale: number) => void;
        sceneData: {
            azimuth: number;
            elevation: number;
            crosshairPos: vec3;
            clipPlane: number[];
            clipPlaneDepthAziElev: number[];
            volScaleMultiplier: number;
            pan2Dxyzmm: vec4;
        };
        renderAzimuth: number;
        renderElevation: number;
        volScaleMultiplier: number;
        crosshairPos: vec3;
        clipPlane: number[];
        clipPlaneDepthAziElev: number[];
        pan2Dxyzmm: vec4;
        _elevation?: number | undefined;
        _azimuth?: number | undefined;
    };
    mediaUrlMap: Map<NVImage | NVMesh, string>;
    initialized: boolean;
    currentDrawUndoBitmap: number;
    loadingText: string;
    subscriptions: Array<Record<string, Subscription>>;
    /**
     * @param options - options object to set modifiable Niivue properties
     */
    constructor(options?: Partial<NiiVueOptions>);
    get volumes(): NVImage[];
    set volumes(volumes: NVImage[]);
    get meshes(): NVMesh[];
    set meshes(meshes: NVMesh[]);
    get drawBitmap(): Uint8Array | null;
    set drawBitmap(drawBitmap: Uint8Array | null);
    get volScaleMultiplier(): number;
    set volScaleMultiplier(scale: number);
    /**
     * save webgl2 canvas as png format bitmap
     * @param filename - filename for screen capture
     * @example niivue.saveScene('test.png');
     * @see {@link https://niivue.github.io/niivue/features/ui.html|live demo usage}
     */
    saveScene(filename?: string): Promise<void>;
    /**
     * attach the Niivue instance to the webgl2 canvas by element id
     * @param id - the id of an html canvas element
     * @param isAntiAlias - determines if anti-aliasing is requested (if not specified, AA usage depends on hardware)
     * @example niivue = new Niivue().attachTo('gl')
     * @example niivue.attachTo('gl')
     * @see {@link https://niivue.github.io/niivue/features/multiplanar.html|live demo usage}
     */
    attachTo(id: string, isAntiAlias?: null): Promise<this>;
    /**
     * register a callback function to run when known Niivue events happen
     * @param event - the name of the event to watch for. Event names are shown in the type column
     * @param callback - the function to call when the event happens
     * @example
     * niivue = new Niivue()
     *
     * // 'location' update event is fired when the crosshair changes position via user input
     * function doSomethingWithLocationData(data)\{
     *    // data has the shape \{mm: [N, N, N], vox: [N, N, N], frac: [N, N, N], values: this.volumes.map(v =\> \{return val\})\}
     *    //...
     * \}
     */
    on(event: string, callback: (data: unknown) => void): void;
    /**
     * off unsubscribes events and subjects (the opposite of on)
     * @param event - the name of the event to watch for. Event names are shown in the type column
     * @example
     * niivue = new Niivue()
     * niivue.off('location')
     */
    off(event: string): void;
    /**
     * attach the Niivue instance to a canvas element directly
     * @param canvas - the canvas element reference
     * @example
     * niivue = new Niivue()
     * niivue.attachToCanvas(document.getElementById(id))
     */
    attachToCanvas(canvas: HTMLCanvasElement, isAntiAlias?: boolean | null): Promise<this>;
    /**
     * Sync the scene controls (orientation, crosshair location, etc.) from one Niivue instance to another. useful for using one canvas to drive another.
     * @param otherNV - the other Niivue instance that is the main controller
     * @example
     * niivue1 = new Niivue()
     * niivue2 = new Niivue()
     * niivue2.syncWith(niivue1)
     * @deprecated use broadcastTo instead
     * @see {@link https://niivue.github.io/niivue/features/sync.mesh.html|live demo usage}
     */
    syncWith(otherNV: Niivue, syncOpts?: {
        '2d': boolean;
        '3d': boolean;
    }): void;
    /**
     * Sync the scene controls (orientation, crosshair location, etc.) from one Niivue instance to others. useful for using one canvas to drive another.
     * @param otherNV - the other Niivue instance(s)
     * @example
     * niivue1 = new Niivue()
     * niivue2 = new Niivue()
     * niivue3 = new Niivue()
     * niivue1.broadcastTo(niivue2)
     * niivue1.broadcastTo([niivue2, niivue3])
     * @see {@link https://niivue.github.io/niivue/features/sync.mesh.html|live demo usage}
     */
    broadcastTo(otherNV: Niivue | Niivue[], syncOpts?: {
        '2d': boolean;
        '3d': boolean;
    }): void;
    /**
     * Sync the scene controls (orientation, crosshair location, etc.) from one Niivue instance to another. useful for using one canvas to drive another.
     * @internal
     * @example
     * niivue1 = new Niivue()
     * niivue2 = new Niivue()
     * niivue2.syncWith(niivue1)
     * niivue2.sync()
     */
    sync(): void;
    /** Not documented publicly for now
     * test if two arrays have equal values for each element
     * @param a - the first array
     * @param b - the second array
     * @example Niivue.arrayEquals(a, b)
     *
     * TODO this should maybe just use array-equal from NPM
     */
    arrayEquals(a: unknown[], b: unknown[]): boolean;
    /**
     * callback function to handle resize window events, redraws the scene.
     * @internal
     */
    resizeListener(): void;
    /**
     * callback to handle mouse move events relative to the canvas
     * @internal
     * @returns the mouse position relative to the canvas
     */
    getRelativeMousePosition(event: MouseEvent, target?: EventTarget | null): {
        x: number;
        y: number;
    } | undefined;
    getNoPaddingNoBorderCanvasRelativeMousePosition(event: MouseEvent, target: EventTarget): {
        x: number;
        y: number;
    } | undefined;
    mouseContextMenuListener(e: MouseEvent): void;
    mouseDownListener(e: MouseEvent): void;
    mouseLeftButtonHandler(e: MouseEvent): void;
    mouseCenterButtonHandler(e: MouseEvent): void;
    mouseRightButtonHandler(e: MouseEvent): void;
    /**
     * calculate the the min and max voxel indices from an array of two values (used in selecting intensities with the selection box)
     * @param array - an array of two values
     * @returns an array of two values representing the min and max voxel indices
     */
    calculateMinMaxVoxIdx(array: number[]): number[];
    calculateNewRange({ volIdx }?: {
        volIdx?: number | undefined;
    }): void;
    generateMouseUpCallback(fracStart: vec3, fracEnd: vec3): void;
    mouseUpListener(): void;
    checkMultitouch(e: TouchEvent): void;
    touchStartListener(e: TouchEvent): void;
    touchEndListener(e: TouchEvent): void;
    mouseMoveListener(e: MouseEvent): void;
    resetBriCon(msg?: TouchEvent | MouseEvent | null): void;
    setDragStart(x: number, y: number): void;
    setDragEnd(x: number, y: number): void;
    touchMoveListener(e: TouchEvent): void;
    handlePinchZoom(e: TouchEvent): void;
    keyUpListener(e: KeyboardEvent): void;
    keyDownListener(e: KeyboardEvent): void;
    wheelListener(e: WheelEvent): void;
    registerInteractions(): void;
    dragEnterListener(e: MouseEvent): void;
    dragOverListener(e: MouseEvent): void;
    getFileExt(fullname: string, upperCase?: boolean): string;
    /**
     * Add an image and notify subscribers
     * @see {@link https://niivue.github.io/niivue/features/document.3d.html|live demo usage}
     */
    addVolumeFromUrl(imageOptions: ImageFromUrlOptions): Promise<NVImage>;
    /**
     * Find media by url
     */
    getMediaByUrl(url: string): NVImage | NVMesh | undefined;
    /**
     * Remove volume by url
     * @param url - Volume added by url to remove
     * @see {@link https://niivue.github.io/niivue/features/document.3d.html|live demo usage}
     */
    removeVolumeByUrl(url: string): void;
    readDirectory(directory: FileSystemDirectoryEntry): FileSystemEntry[];
    /**
     * Returns boolean: true if filename ends with mesh extension (TRK, pial, etc)
     * @param url - filename
     */
    isMeshExt(url: string): boolean;
    dropListener(e: DragEvent): void;
    /**
     * insert a gap between slices of a mutliplanar view.
     * @param pixels - spacing between tiles of multiplanar view
     * @example niivue.setMultiplanarPadPixels(4)
     * @see {@link https://niivue.github.io/niivue/features/atlas.html|live demo usage}
     */
    setMultiplanarPadPixels(pixels: number): void;
    /**
     * control placement of 2D slices.
     * @param layout - AUTO: 0, COLUMN: 1, GRID: 2, ROW: 3,
     * @example niivue.setMultiplanarLayout(2)
     * @see {@link https://niivue.github.io/niivue/features/layout.html|live demo usage}
     */
    setMultiplanarLayout(layout: number): void;
    /**
     * determine if text appears at corner (true) or sides of 2D slice.
     * @param isCornerOrientationText - controls position of text
     * @example niivue.setCornerOrientationText(true)
     * @see {@link https://niivue.github.io/niivue/features/worldspace2.html|live demo usage}
     */
    setCornerOrientationText(isCornerOrientationText: boolean): void;
    /**
     * control whether 2D slices use radiological or neurological convention.
     * @param isRadiologicalConvention - new display convention
     * @example niivue.setCornerOrientationText(true)
     * @see {@link https://niivue.github.io/niivue/features/worldspace.html|live demo usage}
     */
    setRadiologicalConvention(isRadiologicalConvention: boolean): void;
    /**
     * Reset scene to default settings.
     * @param options - @see NiiVueOptions
     * @param resetBriCon - also reset contrast (default false).
     * @example niivue.nv1.setDefaults(opts, true);
     * @see {@link https://niivue.github.io/niivue/features/connectome.html|live demo usage}
     */
    setDefaults(options?: Partial<NiiVueOptions>, resetBriCon?: boolean): void;
    /**
     * Limit visibility of mesh in front of a 2D image. Requires world-space mode.
     * @param meshThicknessOn2D - distance from voxels for clipping mesh. Use Infinity to show entire mesh or 0.0 to hide mesh.
     * @example niivue.setMeshThicknessOn2D(42)
     * @see {@link https://niivue.github.io/niivue/features/worldspace2.html|live demo usage}
     */
    setMeshThicknessOn2D(meshThicknessOn2D: number): void;
    /**
     * Create a custom multi-slice mosaic (aka lightbox, montage) view.
     * @param str - description of mosaic.
     * @example niivue.setSliceMosaicString("A 0 20 C 30 S 42")
     * @see {@link https://niivue.github.io/niivue/features/mosaics.html|live demo usage}
     */
    setSliceMosaicString(str: string): void;
    /**
     * control 2D slice view mode.
     * @param isSliceMM - control whether 2D slices use world space (true) or voxel space (false). Beware that voxel space mode limits properties like panning, zooming and mesh visibility.
     * @example niivue.setSliceMM(true)
     * @see {@link https://niivue.github.io/niivue/features/worldspace2.html|live demo usage}
     */
    setSliceMM(isSliceMM: boolean): void;
    /**
     * control whether voxel overlays are combined using additive (emission) or traditional (transmission) blending.
     * @param isAdditiveBlend - emission (true) or transmission (false) mixing
     * @example niivue.isAdditiveBlend(true)
     * @see {@link https://niivue.github.io/niivue/features/additive.voxels.html|live demo usage}
     */
    setAdditiveBlend(isAdditiveBlend: boolean): void;
    /**
     * Detect if display is using radiological or neurological convention.
     * @returns radiological convention status
     * @example let rc = niivue.getRadiologicalConvention()
     */
    getRadiologicalConvention(): boolean;
    /**
     * Force WebGL canvas to use high resolution display, regardless of browser defaults.
     * @param isHighResolutionCapable - allow high-DPI display
     * @example niivue.setHighResolutionCapable(true);
     * @see {@link https://niivue.github.io/niivue/features/sync.mesh.html|live demo usage}
     */
    setHighResolutionCapable(isHighResolutionCapable: boolean): void;
    /**
     * add a new volume to the canvas
     * @param volume - the new volume to add to the canvas
     * @example
     * niivue = new Niivue()
     * niivue.addVolume(NVImage.loadFromUrl(\{url:'../someURL.nii.gz'\}))
     * @see {@link https://niivue.github.io/niivue/features/document.3d.html|live demo usage}
     */
    addVolume(volume: NVImage): void;
    /**
     * add a new mesh to the canvas
     * @param mesh - the new mesh to add to the canvas
     * @example
     * niivue = new Niivue()
     * niivue.addMesh(NVMesh.loadFromUrl(\{url:'../someURL.gii'\}))
     * @see {@link https://niivue.github.io/niivue/features/document.3d.html|live demo usage}
     */
    addMesh(mesh: NVMesh): void;
    /**
     * get the index of a volume by its unique id. unique ids are assigned to the NVImage.id property when a new NVImage is created.
     * @param id - the id string to search for
     * @example
     * niivue = new Niivue()
     * niivue.getVolumeIndexByID(someVolume.id)
     */
    getVolumeIndexByID(id: string): number;
    drawAddUndoBitmap(): void;
    drawClearAllUndoBitmaps(): void;
    /**
     * Restore drawing to previous state
     * @example niivue.drawUndo();
     * @see {@link https://niivue.github.io/niivue/features/draw.ui.html|live demo usage}
     */
    drawUndo(): void;
    loadDrawing(drawingBitmap: NVImage): boolean;
    binarize(volume: NVImage): void;
    /**
     * Open drawing
     * @param filename - of NIfTI format drawing
     * @param isBinarize - if true will force drawing voxels to be either 0 or 1.
     * @example niivue.loadDrawingFromUrl("../images/lesion.nii.gz");
     * @see {@link https://niivue.github.io/niivue/features/draw.ui.html|live demo usage}
     */
    loadDrawingFromUrl(fnm: string, isBinarize?: boolean): Promise<boolean>;
    findOtsu(mlevel?: number): number[];
    /**
     * remove dark voxels in air
     * @param levels - (2-4) segment brain into this many types. For example drawOtsu(2) will create a binary drawing where bright voxels are colored and dark voxels are clear.
     * @example niivue.drawOtsu(3);
     * @see {@link https://niivue.github.io/niivue/features/draw.ui.html|live demo usage}
     */
    drawOtsu(levels?: number): void;
    /**
     * remove dark voxels in air
     * @param level - (1-5) larger values for more preserved voxels
     * @param volIndex - volume to dehaze
     * @example niivue.removeHaze(3, 0);
     * @see {@link https://niivue.github.io/niivue/features/draw.ui.html|live demo usage}
     */
    removeHaze(level?: number, volIndex?: number): void;
    /**
     * save voxel-based image to disk
     * @param fnm - filename of NIfTI image to create
     * @param isSaveDrawing - determines whether drawing or background image is saved
     * @param volumeByIndex - determines layer to save (0 for background)
     * @param volumeByIndex - determines layer to save (0 for background)
     * @example niivue.saveImage(\{ filename: "myimage.nii.gz", isSaveDrawing: true \});
     * @see {@link https://niivue.github.io/niivue/features/draw.ui.html|live demo usage}
     */
    saveImage(options?: SaveImageOptions): Uint8Array | boolean;
    getMeshIndexByID(id: string | number): number;
    /**
     * change property of mesh, tractogram or connectome
     * @param id - identity of mesh to change
     * @param key - attribute to change
     * @param value - for attribute
     * @example niivue.setMeshProperty(niivue.meshes[0].id, 'fiberLength', 42)
     * @see {@link https://niivue.github.io/niivue/features/meshes.html|live demo usage}
     */
    setMeshProperty(id: number, key: keyof NVMesh, val: number): void;
    /**
     * returns the index of the mesh vertex that is closest to the provided coordinates
     * @param id - identity of mesh to change
     * @param Xmm - location in left/right dimension
     * @param Ymm - location in posterior/anterior dimension
     * @param Zmm - location in foot/head dimension
     * @returns the an array where ret[0] is the mesh index and ret[1] is distance from vertex to coordinates
     * @example niivue.indexNearestXYZmm(niivue.meshes[0].id, -22, 42, 13)
     * @see {@link https://niivue.github.io/niivue/features/clipplanes.html | live demo usage}
     */
    indexNearestXYZmm(mesh: number, Xmm: number, Ymm: number, Zmm: number): number[];
    /**
     * reverse triangle winding of mesh (swap front and back faces)
     * @param id - identity of mesh to change
     * @example niivue.reverseFaces(niivue.meshes[0].id)
     * @see {@link https://niivue.github.io/niivue/features/meshes.html|live demo usage}
     */
    reverseFaces(mesh: number): void;
    /**
     * reverse triangle winding of mesh (swap front and back faces)
     * @param mesh - identity of mesh to change
     * @param layer - selects the mesh overlay (e.g. GIfTI or STC file)
     * @param key - attribute to change
     * @param value - for attribute
     * @example niivue.setMeshLayerProperty(niivue.meshes[0].id, 0, 'frame4D', 22)
     * @see {@link https://niivue.github.io/niivue/features/mesh.4D.html|live demo usage}
     */
    setMeshLayerProperty(mesh: number, layer: number, key: keyof NVMeshLayer, val: number): void;
    /**
     * adjust offset position and scale of 2D sliceScale
     * @param xyzmmZoom - first three components are spatial, fourth is scaling
     * @example niivue.setPan2Dxyzmm([5,-4, 2, 1.5])
     */
    setPan2Dxyzmm(xyzmmZoom: vec4): void;
    /**
     * set rotation of 3D render view
     * @example niivue.setRenderAzimuthElevation(45, 15)
     * @see {@link https://niivue.github.io/niivue/features/mask.html|live demo usage}
     */
    setRenderAzimuthElevation(a: number, e: number): void;
    /**
     * get the index of an overlay by its unique id. unique ids are assigned to the NVImage.id property when a new NVImage is created.
     * @param id - the id string to search for
     * @see NiiVue#getVolumeIndexByID
     * @example
     * niivue = new Niivue()
     * niivue.getOverlayIndexByID(someVolume.id)
     */
    getOverlayIndexByID(id: string): number;
    /**
     * set the index of a volume. This will change it's ordering and appearance if there are multiple volumes loaded.
     * @param volume - the volume to update
     * @param toIndex - the index to move the volume to. The default is the background (0 index)
     * @example
     * niivue = new Niivue()
     * niivue.setVolume(someVolume, 1) // move it to the second position in the array of loaded volumes (0 is the first position)
     */
    setVolume(volume: NVImage, toIndex?: number): void;
    setMesh(mesh: NVMesh, toIndex?: number): void;
    /**
     * Remove a volume
     * @param volume - volume to delete
     * @example
     * niivue = new Niivue()
     * niivue.removeVolume(this.volumes[3])
     * @see {@link https://niivue.github.io/niivue/features/document.3d.html|live demo usage}
     */
    removeVolume(volume: NVImage): void;
    /**
     * Remove a volume by index
     * @param index - of volume to remove
     */
    removeVolumeByIndex(index: number): void;
    /**
     * Remove a triangulated mesh, connectome or tractogram
     * @param mesh - mesh to delete
     * @example
     * niivue = new Niivue()
     * niivue.removeMesh(this.meshes[3])
     * @see {@link https://niivue.github.io/niivue/features/multiuser.meshes.html|live demo usage}
     */
    removeMesh(mesh: NVMesh): void;
    /**
     * Remove a triangulated mesh, connectome or tractogram
     * @param url - URL of mesh to delete
     * @example
     * niivue.removeMeshByUrl('../images/cit168.mz3')
     */
    removeMeshByUrl(url: string): void;
    /**
     * Move a volume to the bottom of the stack of loaded volumes. The volume will become the background
     * @param volume - the volume to move
     * @example
     * niivue = new Niivue()
     * niivue.moveVolumeToBottom(this.volumes[3]) // move the 4th volume to the 0 position. It will be the new background
     */
    moveVolumeToBottom(volume: NVImage): void;
    /**
     * Move a volume up one index position in the stack of loaded volumes. This moves it up one layer
     * @param volume - the volume to move
     * @example
     * niivue = new Niivue()
     * niivue.moveVolumeUp(this.volumes[0]) // move the background image to the second index position (it was 0 index, now will be 1)
     */
    moveVolumeUp(volume: NVImage): void;
    /**
     * Move a volume down one index position in the stack of loaded volumes. This moves it down one layer
     * @param volume - the volume to move
     * @example
     * niivue = new Niivue()
     * niivue.moveVolumeDown(this.volumes[1]) // move the second image to the background position (it was 1 index, now will be 0)
     */
    moveVolumeDown(volume: NVImage): void;
    /**
     * Move a volume to the top position in the stack of loaded volumes. This will be the top layer
     * @param volume - the volume to move
     * @example
     * niivue = new Niivue()
     * niivue.moveVolumeToTop(this.volumes[0]) // move the background image to the top layer position
     */
    moveVolumeToTop(volume: NVImage): void;
    mouseDown(x: number, y: number): void;
    mouseMove(x: number, y: number): void;
    /**
     * convert spherical AZIMUTH, ELEVATION to Cartesian
     * @param azimuth - azimuth number
     * @param elevation - elevation number
     * @returns the converted [x, y, z] coordinates
     * @example
     * niivue = new Niivue()
     * xyz = niivue.sph2cartDeg(42, 42)
     */
    sph2cartDeg(azimuth: number, elevation: number): number[];
    /**
     * update the clip plane orientation in 3D view mode
     * @param azimuthElevationDepth - a two component vector. azimuth: camera position in degrees around object, typically 0..360 (or -180..+180). elevation: camera height in degrees, range -90..90
     * @example
     * niivue = new Niivue()
     * niivue.setClipPlane([42, 42])
     * @see {@link https://niivue.github.io/niivue/features/mask.html|live demo usage}
     */
    setClipPlane(depthAzimuthElevation: number[]): void;
    /**
     * set the crosshair and colorbar outline color
     * @param color - an RGBA array. values range from 0 to 1
     * @example
     * niivue = new Niivue()
     * niivue.setCrosshairColor([0, 1, 0, 0.5]) // set crosshair to transparent green
     * @see {@link https://niivue.github.io/niivue/features/colormaps.html|live demo usage}
     */
    setCrosshairColor(color: number[]): void;
    /**
     * set thickness of crosshair
     * @example niivue.crosshairWidth(2)
     * @see {@link https://niivue.github.io/niivue/features/colormaps.html|live demo usage}
     */
    setCrosshairWidth(crosshairWidth: number): void;
    setDrawColormap(name: string): void;
    /**
     * does dragging over a 2D slice create a drawing?
     * @param trueOrFalse - enabled (true) or not (false)
     * @example niivue.setDrawingEnabled(true)
     * @see {@link https://niivue.github.io/niivue/features/draw.ui.html|live demo usage}
     */
    setDrawingEnabled(trueOrFalse: boolean): void;
    /**
     * determine color and style of drawing
     * @param penValue - sets the color of the pen
     * @param isFilledPen - determines if dragging creates flood-filled shape
     * @example niivue.setPenValue(1, true)
     * @see {@link https://niivue.github.io/niivue/features/draw.ui.html|live demo usage}
     */
    setPenValue(penValue: number, isFilledPen?: boolean): void;
    /**
     * control whether drawing is transparent (0), opaque (1) or translucent (between 0 and 1).
     * @param opacity - translucency of drawing
     * @example niivue.setDrawOpacity(0.7)
     * @see {@link https://niivue.github.io/niivue/features/draw.ui.html|live demo usage}
     */
    setDrawOpacity(opacity: number): void;
    /**
     * set the selection box color. A selection box is drawn when you right click and drag to change image contrast
     * @param color - an RGBA array. values range from 0 to 1
     * @example
     * niivue = new Niivue()
     * niivue.setSelectionBoxColor([0, 1, 0, 0.5]) // set to transparent green
     * @see {@link https://niivue.github.io/niivue/features/colormaps.html|live demo usage}
     */
    setSelectionBoxColor(color: number[]): void;
    sliceScroll2D(posChange: number, x: number, y: number, isDelta?: boolean): void;
    /**
     * set the slice type. This changes the view mode
     * @param sliceType - an enum of slice types to use
     * @example
     * niivue = new Niivue()
     * niivue.setSliceType(Niivue.sliceTypeMultiplanar)
     * @see {@link https://niivue.github.io/niivue/features/basic.multiplanar.html|live demo usage}
     */
    setSliceType(st: SLICE_TYPE): this;
    /**
     * set the opacity of a volume given by volume index
     * @param volIdx - the volume index of the volume to change
     * @param newOpacity - the opacity value. valid values range from 0 to 1. 0 will effectively remove a volume from the scene
     * @example
     * niivue = new Niivue()
     * niivue.setOpacity(0, 0.5) // make the first volume transparent
     * @see {@link https://niivue.github.io/niivue/features/atlas.html|live demo usage}
     */
    setOpacity(volIdx: number, newOpacity: number): void;
    /**
     * set the scale of the 3D rendering. Larger numbers effectively zoom.
     * @param scale - the new scale value
     * @example
     * niivue.setScale(2) // zoom some
     * @see {@link https://niivue.github.io/niivue/features/shiny.volumes.html|live demo usage}
     */
    setScale(scale: number): void;
    /**
     * set the color of the 3D clip plane
     * @param color - the new color. expects an array of RGBA values. values can range from 0 to 1
     * @example
     * niivue.setClipPlaneColor([1, 1, 1, 0.5]) // white, transparent
     * @see {@link https://niivue.github.io/niivue/features/clipplanes.html|live demo usage}
     */
    setClipPlaneColor(color: number[]): void;
    /**
     * set proportion of volume rendering influenced by selected matcap.
     * @param gradientAmount - amount of matcap (0..1), default 0 (matte, surface normal does not influence color)
     * @example
     * niivue.setVolumeRenderIllumination(0.6);
     * @see {@link https://niivue.github.io/niivue/features/shiny.volumes.html|live demo usage}
     */
    setVolumeRenderIllumination(gradientAmount?: number): Promise<void>;
    overlayRGBA(volume: NVImage): Uint8ClampedArray;
    vox2mm(XYZ: number[], mtx: mat4): vec3;
    /**
     * clone a volume and return a new volume
     * @param index - the index of the volume to clone
     * @returns new volume to work with, but that volume is not added to the canvas
     * @example
     * niivue = new Niivue()
     * niivue.cloneVolume(0)
     */
    cloneVolume(index: number): NVImage;
    /**
     *
     * @param url - URL of NVDocument
     */
    loadDocumentFromUrl(url: string): Promise<void>;
    /**
     * Loads an NVDocument
     * @returns  Niivue instance
     * @see {@link https://niivue.github.io/niivue/features/document.load.html|live demo usage}
     */
    loadDocument(document: NVDocument): this;
    /**
   * generates JavaScript to load the current scene as a document
   * @param canvasId - id of canvas NiiVue will be attached to
   * @param esm - bundled version of NiiVue
   * @example
   * const javascript = this.generateLoadDocumentJavaScript("gl1");
   * const html = \`<html><body><canvas id="gl1"></canvas>\<script type="module" async\>
          $\{javascript\}</script></body></html>\`;
   */
    generateLoadDocumentJavaScript(canvasId: string, esm: string): string;
    /**
     * generates HTML of current scene
     * @param canvasId - id of canvas NiiVue will be attached to
     * @param esm - bundled version of NiiVue
     * @returns HTML with javascript of the current scene
     * @example
     * const template = \`<html><body><canvas id="gl1"></canvas>\<script type="module" async\>
     *       %%javascript%%</script></body></html>\`;
     * nv1.generateHTML("page.html", esm);
     */
    generateHTML(canvasId: string | undefined, esm: string): string;
    /**
     * save current scene as HTML
     * @param fileName - the name of the HTML file
     * @param canvasId - id of canvas NiiVue will be attached to
     * @param esm - bundled version of NiiVue
     */
    saveHTML(fileName: string | undefined, canvasId: string | undefined, esm: string): void;
    /**
     * Converts NiiVue scene to JSON
     */
    json(): ExportDocumentData;
    /**
     * save the entire scene (objects and settings) as a document
     * @param fileName - the name of the document storing the scene
     * @example
     * niivue.saveDocument("niivue.basic.nvd")
     * @see {@link https://niivue.github.io/niivue/features/document.3d.html|live demo usage}
     */
    saveDocument(fileName?: string): Promise<void>;
    /**
     * load an array of volume objects
     * @param volumeList - the array of objects to load. each object must have a resolvable "url" property at a minimum
     * @returns returns the Niivue instance
     * @example
     * niivue = new Niivue()
     * niivue.loadVolumes([\{url: 'someImage.nii.gz\}, \{url: 'anotherImage.nii.gz\'\}])
     * @see {@link https://niivue.github.io/niivue/features/mask.html|live demo usage}
     */
    loadVolumes(volumeList: ImageFromUrlOptions[]): Promise<this>;
    /**
     * Add mesh and notify subscribers
     * @see {@link https://niivue.github.io/niivue/features/multiuser.meshes.html|live demo usage}
     */
    addMeshFromUrl(meshOptions: LoadFromUrlParams): Promise<NVMesh>;
    /**
     * load an array of meshes
     * @param meshList - the array of objects to load. each object must have a resolvable "url" property at a minimum
     * @returns Niivue instance
     * @example
     * niivue = new Niivue()
     * niivue.loadMeshes([\{url: 'someMesh.gii'\}])
     * @see {@link https://niivue.github.io/niivue/features/meshes.html|live demo usage}
     */
    loadMeshes(meshList: LoadFromUrlParams[]): Promise<this>;
    /**
     * load a connectome specified by url
     * @returns Niivue instance
     * @see {@link https://niivue.github.io/niivue/features/connectome.html|live demo usage}
     */
    loadConnectomeFromUrl(url: string, headers?: {}): Promise<this>;
    /**
     * load a connectome specified by url
     * @returns Niivue instance
     * @see {@link https://niivue.github.io/niivue/features/connectome.html|live demo usage}
     */
    loadFreeSurferConnectomeFromUrl(url: string, headers?: {}): Promise<this>;
    /**
     * load a connectome specified by json
     * @param connectome - freesurfer model
     * @returns Niivue instance
     * @see {@link https://niivue.github.io/niivue/features/connectome.html|live demo usage}
     */
    loadFreeSurferConnectome(json: FreeSurferConnectome): Promise<this>;
    handleNodeAdded(event: {
        detail: {
            node: NVConnectomeNode;
        };
    }): void;
    /**
     * load a connectome specified by json
     * @param connectome - model
     * @returns Niivue instance
     * @see {@link https://niivue.github.io/niivue/features/connectome.html|live demo usage}
     */
    loadConnectome(json: Connectome | LegacyConnectome): this;
    /**
     * generate a blank canvas for the pen tool
     * @example niivue.createEmptyDrawing()
     * @see {@link https://niivue.github.io/niivue/features/cactus.html|live demo usage}
     */
    createEmptyDrawing(): void;
    r16Tex(texID: WebGLTexture | null, activeID: number, dims: number[], img16: Int16Array): WebGLTexture;
    /**
     * dilate drawing so all voxels are colored.
     * works on drawing with multiple colors
     * @example niivue.drawGrowCut();
     * @see {@link https://niivue.github.io/niivue/features/draw2.html|live demo usage}
     */
    drawGrowCut(): void;
    drawPt(x: number, y: number, z: number, penValue: number): void;
    drawPenLine(ptA: number[], ptB: number[], penValue: number): void;
    drawFloodFillCore(img: Uint8Array, seedVx: number, neighbors?: number): void;
    drawFloodFill(seedXYZ: number[], newColor?: number, growSelectedCluster?: number, // if non-zero, growth based on background intensity POSITIVE_INFINITY for selected or bright, NEGATIVE_INFINITY for selected or darker
    forceMin?: number, forceMax?: number, neighbors?: number): void;
    drawPenFilled(): void;
    /**
     * close drawing: make sure you have saved any changes before calling this!
     * @example niivue.closeDrawing();
     * @see {@link https://niivue.github.io/niivue/features/draw.ui.html|live demo usage}
     */
    closeDrawing(): void;
    /**
     * copy drawing bitmap from CPU to GPU storage and redraw the screen
     * @param isForceRedraw - refreshes scene immediately (default true)
     * @example niivue.refreshDrawing();
     * @see {@link https://niivue.github.io/niivue/features/cactus.html|live demo usage}
     */
    refreshDrawing(isForceRedraw?: boolean): void;
    r8Tex(texID: WebGLTexture | null, activeID: number, dims: number[], isInit?: boolean): WebGLTexture | null;
    rgbaTex(texID: WebGLTexture | null, activeID: number, dims: number[], isInit?: boolean): WebGLTexture | null;
    requestCORSIfNotSameOrigin(img: HTMLImageElement, url: string): void;
    loadPngAsTexture(pngUrl: string, textureNum: number): Promise<WebGLTexture | null>;
    loadFontTexture(fontUrl: string): Promise<WebGLTexture | null>;
    loadBmpTexture(bmpUrl: string): Promise<WebGLTexture | null>;
    /**
     * Load matcap for illumination model.
     * @param name - name of matcap to load ("Shiny", "Cortex", "Cream")
     * @example
     * niivue.loadMatCapTexture("Cortex");
     * @see {@link https://niivue.github.io/niivue/features/shiny.volumes.html|live demo usage}
     */
    loadMatCapTexture(bmpUrl: string): Promise<WebGLTexture | null>;
    initFontMets(): void;
    /**
     * Load typeface for colorbars, measurements and orientation text.
     * @param name - name of matcap to load ("Roboto", "Garamond", "Ubuntu")
     * @example
     * niivue.loadMatCapTexture("Cortex");
     * @see {@link https://niivue.github.io/niivue/features/selectfont.html|live demo usage}
     */
    loadFont(fontSheetUrl?: any, metricsUrl?: {
        atlas: {
            type: string;
            distanceRange: number;
            size: number;
            width: number;
            height: number;
            yOrigin: string;
        };
        metrics: {
            emSize: number;
            lineHeight: number;
            ascender: number;
            descender: number;
            underlineY: number;
            underlineThickness: number;
        };
        glyphs: ({
            unicode: number;
            advance: number;
            planeBounds?: undefined;
            atlasBounds?: undefined;
        } | {
            unicode: number;
            advance: number;
            planeBounds: {
                left: number;
                bottom: number;
                right: number;
                top: number;
            };
            atlasBounds: {
                left: number;
                bottom: number;
                right: number;
                top: number;
            };
        })[];
        kerning: never[];
    }): Promise<void>;
    loadDefaultMatCap(): Promise<WebGLTexture | null>;
    loadDefaultFont(): Promise<void>;
    initText(): Promise<void>;
    meshShaderNameToNumber(meshShaderName?: string): number | undefined;
    /**
     * select new shader for triangulated meshes and connectomes. Note that this function requires the mesh is fully loaded: you may want use `await` with loadMeshes (as seen in live demo).
     * @param id - id of mesh to change
     * @param meshShaderNameOrNumber - identify shader for usage
     * @example niivue.setMeshShader('toon');
     * @see {@link https://niivue.github.io/niivue/features/meshes.html|live demo usage}
     */
    setMeshShader(id: number, meshShaderNameOrNumber?: number): void;
    /**
     *
     * @param fragmentShaderText - custom fragment shader.
     * @param name - title for new shader.
     * @returns created custom mesh shader
     */
    createCustomMeshShader(fragmentShaderText: string, name?: string): {
        Name: string;
        Frag: string;
        shader: Shader;
    };
    /**
     * Define a new GLSL shader program to influence mesh coloration
     * @param fragmentShaderText - custom fragment shader.
     * @param ame - title for new shader.
     * @returns index of the new shader (for setMeshShader)
     * @see {@link https://niivue.github.io/niivue/features/mesh.atlas.html|live demo usage}
     */
    setCustomMeshShader(fragmentShaderText?: string, name?: string): number;
    /**
     * retrieve all currently loaded meshes
     * @param sort - sort output alphabetically
     * @returns list of available mesh shader names
     * @example niivue.meshShaderNames();
     * @see {@link https://niivue.github.io/niivue/features/meshes.html|live demo usage}
     */
    meshShaderNames(sort?: boolean): string[];
    initRenderShader(shader: Shader, gradientAmount?: number): void;
    init(): Promise<this>;
    gradientGL(hdr: NiftiHeader): void;
    /**
     * update the webGL 2.0 scene after making changes to the array of volumes. It's always good to call this method after altering one or more volumes manually (outside of Niivue setter methods)
     * @example
     * niivue = new Niivue()
     * niivue.updateGLVolume()
     * @see {@link https://niivue.github.io/niivue/features/colormaps.html|live demo usage}
     */
    updateGLVolume(): void;
    /**
     * basic statistics for selected voxel-based image
     * @param layer - selects image to describe
     * @param masks - are optional binary images to filter voxles
     * @returns numeric values to describe image
     * @example niivue.getDescriptives(0);
     * @see {@link https://niivue.github.io/niivue/features/draw2.html|live demo usage}
     */
    getDescriptives(layer?: number, masks?: never[], drawingIsMask?: boolean): Descriptive;
    refreshLayers(overlayItem: NVImage, layer: number): void;
    /**
     * query all available color maps that can be applied to volumes
     * @param sort - whether or not to sort the returned array
     * @returns an array of colormap strings
     * @example
     * niivue = new Niivue()
     * colormaps = niivue.colormaps()
     * @see {@link https://niivue.github.io/niivue/features/colormaps.html|live demo usage}
     */
    colormaps(): string[];
    /**
     * create a new colormap
     * @param key - name of new colormap
     * @param colormap - properties (Red, Green, Blue, Alpha and Indices)
     * @see {@link https://niivue.github.io/niivue/features/colormaps.html|live demo usage}
     */
    addColormap(key: string, cmap: ColorMap): void;
    /**
     * update the colormap of an image given its ID
     * @param id - the ID of the NVImage
     * @param colormap - the name of the colormap to use
     * @example
     * niivue.setColormap(niivue.volumes[0].id,, 'red')
     * @see {@link https://niivue.github.io/niivue/features/colormaps.html|live demo usage}
     */
    setColormap(id: string, colormap: string): void;
    /**
     * darken crevices and brighten corners when 3D rendering drawings.
     * @param amount - amount of ambient occlusion (default 0.4)
     * @see {@link https://niivue.github.io/niivue/features/torso.html|live demo usage}
     */
    setRenderDrawAmbientOcclusion(ao: number): void;
    setColorMap(id: string, colormap: string): void;
    /**
     * use given color map for negative voxels in image
     * @param id - the ID of the NVImage
     * @param colormapNegative - the name of the colormap to use
     * @example
     * niivue = new Niivue()
     * niivue.setColormapNegative(niivue.volumes[1].id,"winter");
     * @see {@link https://niivue.github.io/niivue/features/mosaics2.html|live demo usage}
     */
    setColormapNegative(id: string, colormapNegative: string): void;
    /**
     * modulate intensity of one image based on intensity of another
     * @param idTarget - the ID of the NVImage to be biased
     * @param idModulation - the ID of the NVImage that controls bias (null to disable modulation)
     * @param modulateAlpha - does the modulation influence alpha transparency (values greater than 1).
     * @example niivue.setModulationImage(niivue.volumes[0].id, niivue.volumes[1].id);
     * @see {@link https://niivue.github.io/niivue/features/modulate.html|live demo scalar usage}
     * @see {@link https://niivue.github.io/niivue/features/modulateAfni.html|live demo usage}
     */
    setModulationImage(idTarget: string, idModulation: string, modulateAlpha?: number): void;
    /**
     * adjust screen gamma. Low values emphasize shadows but can appear flat, high gamma hides shadow details.
     * @param gamma - selects luminance, default is 1
     * @example niivue.setGamma(1.0);
     * @see {@link https://niivue.github.io/niivue/features/colormaps.html|live demo usage}
     */
    setGamma(gamma?: number): void;
    /** Load all volumes for image opened with `limitFrames4D`, the user can also click the `...` on a 4D timeline to load deferred volumes
     * @param id - the ID of the 4D NVImage
     **/
    loadDeferred4DVolumes(id: string): Promise<void>;
    /**
     * show desired 3D volume from 4D time series
     * @param id - the ID of the 4D NVImage
     * @param frame4D - frame to display (indexed from zero)
     * @example nv1.setFrame4D(nv1.volumes[0].id, 42);
     * @see {@link https://niivue.github.io/niivue/features/timeseries.html|live demo usage}
     */
    setFrame4D(id: string, frame4D: number): void;
    /**
     * determine active 3D volume from 4D time series
     * @param id - the ID of the 4D NVImage
     * @returns currently selected volume (indexed from 0)
     * @example nv1.getFrame4D(nv1.volumes[0].id);
     * @see {@link https://niivue.github.io/niivue/features/timeseries.html|live demo usage}
     */
    getFrame4D(id: string): number;
    colormapFromKey(name: string): ColorMap;
    colormap(lutName?: string, isInvert?: boolean): Uint8ClampedArray;
    createColormapTexture(texture?: WebGLTexture | null, nRow?: number, nCol?: number): WebGLTexture | null;
    addColormapList(nm?: string, mn?: number, mx?: number, alpha?: boolean, neg?: boolean, vis?: boolean, inv?: boolean): void;
    refreshColormaps(): this | undefined;
    sliceScale(forceVox?: boolean): SliceScale;
    tileIndex(x: number, y: number): number;
    inRenderTile(x: number, y: number): number;
    sliceScroll3D(posChange?: number): void;
    deleteThumbnail(): void;
    inGraphTile(x: number, y: number): boolean;
    mouseClick(x: number, y: number, posChange?: number, isDelta?: boolean): void;
    drawRuler(): void;
    drawRuler10cm(startXYendXY: number[]): void;
    screenXY2mm(x: number, y: number, forceSlice?: number): vec4;
    dragForPanZoom(startXYendXY: number[]): void;
    dragForCenterButton(startXYendXY: number[]): void;
    dragForSlicer3D(startXYendXY: number[]): void;
    drawMeasurementTool(startXYendXY: number[]): void;
    drawRect(leftTopWidthHeight: number[], lineColor?: number[]): void;
    drawCircle(leftTopWidthHeight: number[], circleColor?: number[], fillPercent?: number): void;
    drawSelectionBox(leftTopWidthHeight: number[]): void;
    effectiveCanvasHeight(): number;
    effectiveCanvasWidth(): number;
    getAllLabels(): NVLabel3D[];
    getBulletMarginWidth(): number;
    getLegendPanelWidth(): number;
    getLegendPanelHeight(): number;
    reserveColorbarPanel(): number[];
    drawColorbarCore(layer: number | undefined, leftTopWidthHeight: number[] | undefined, isNegativeColor: boolean | undefined, min: number | undefined, max: number | undefined, isAlphaThreshold: boolean): void;
    drawColorbar(): void;
    textWidth(scale: number, str: string): number;
    textHeight(scale: number, str: string): number;
    drawChar(xy: number[], scale: number, char: number): number;
    drawLoadingText(text: string): void;
    drawText(xy: number[], str: string, scale?: number, color?: number[] | null): void;
    drawTextRight(xy: number[], str: string, scale?: number, color?: number[] | null): void;
    drawTextLeft(xy: number[], str: string, scale?: number, color?: number[] | null): void;
    drawTextRightBelow(xy: number[], str: string, scale?: number, color?: number[] | null): void;
    drawTextBetween(startXYendXY: number[], str: string, scale?: number, color?: number[] | null): void;
    drawTextBelow(xy: number[], str: string, scale?: number, color?: number[] | null): void;
    updateInterpolation(layer: number, isForceLinear?: boolean): void;
    setAtlasOutline(isOutline: number): void;
    /**
     * select between nearest and linear interpolation for voxel based images
     * @param isNearest - whether nearest neighbor interpolation is used, else linear interpolation
     * @example niivue.setInterpolation(true);
     * @see {@link https://niivue.github.io/niivue/features/draw2.html|live demo usage}
     */
    setInterpolation(isNearest: boolean): void;
    calculateMvpMatrix2D(leftTopWidthHeight: number[], mn: vec3, mx: vec3, clipTolerance: number | undefined, clipDepth: number | undefined, azimuth: number | undefined, elevation: number | undefined, isRadiolgical: boolean): MvpMatrix2D;
    swizzleVec3MM(v3: vec3, axCorSag: SLICE_TYPE): vec3;
    screenFieldOfViewVox(axCorSag?: number): vec3;
    screenFieldOfViewMM(axCorSag?: number, forceSliceMM?: boolean): vec3;
    screenFieldOfViewExtendedVox(axCorSag?: number): MM;
    screenFieldOfViewExtendedMM(axCorSag?: number): MM;
    drawSliceOrientationText(leftTopWidthHeight: number[], axCorSag: SLICE_TYPE): void;
    xyMM2xyzMM(axCorSag: SLICE_TYPE, sliceFrac: number): number[];
    draw2D(leftTopWidthHeight: number[], axCorSag: SLICE_TYPE, customMM?: number): void;
    calculateMvpMatrix(_unused: unknown, leftTopWidthHeight: number[] | undefined, azimuth: number, elevation: number): mat4[];
    calculateModelMatrix(azimuth: number, elevation: number): mat4;
    calculateRayDirection(azimuth: number, elevation: number): vec3;
    sceneExtentsMinMax(isSliceMM?: boolean): vec3[];
    setPivot3D(): void;
    getMaxVols(): number;
    detectPartialllyLoaded4D(): boolean;
    drawGraph(): void;
    depthPicker(leftTopWidthHeight: number[], mvpMatrix: mat4): void;
    drawImage3D(mvpMatrix: mat4, azimuth: number, elevation: number): void;
    drawOrientationCube(leftTopWidthHeight: number[], azimuth?: number, elevation?: number): void;
    createOnLocationChange(axCorSag?: number): void;
    /**
     * Add a 3D Label
     * @param text - text of the label
     * @param style - label style
     * @param point - 3D point on the model
     */
    addLabel(text: string, style: NVLabel3DStyle, points?: number[] | number[][]): NVLabel3D;
    calculateScreenPoint(point: [number, number, number], mvpMatrix: mat4, leftTopWidthHeight: number[]): vec4;
    getLabelAtPoint(screenPoint: [number, number]): NVLabel3D | null;
    drawLabelLine(label: NVLabel3D, pos: vec2, mvpMatrix: mat4, leftTopWidthHeight: number[], secondPass?: boolean): void;
    draw3DLabel(label: NVLabel3D, pos: vec2, mvpMatrix: mat4, leftTopWidthHeight: number[], bulletMargin: number | undefined, legendWidth: number, secondPass?: boolean): void;
    draw3DLabels(mvpMatrix: mat4, leftTopWidthHeight: number[], secondPass?: boolean): void;
    draw3D(leftTopWidthHeight?: number[], mvpMatrix?: mat4 | null, modelMatrix?: mat4 | null, normalMatrix?: mat4 | null, azimuth?: number | null, elevation?: number): string | undefined;
    drawMesh3D(isDepthTest?: boolean, alpha?: number, m?: mat4, modelMtx?: mat4, normMtx?: mat4): void;
    drawCrosshairs3D(isDepthTest?: boolean, alpha?: number, mvpMtx?: mat4 | null, is2DView?: boolean, isSliceMM?: boolean): void;
    mm2frac(mm: vec3 | vec4, volIdx?: number, isForceSliceMM?: boolean): vec3;
    vox2frac(vox: vec3, volIdx?: number): vec3;
    frac2vox(frac: vec3, volIdx?: number): vec3;
    /**
     * move crosshair a fixed number of voxels (not mm)
     * @param x - translate left (-) or right (+)
     * @param y - translate posterior (-) or +anterior (+)
     * @param z - translate inferior (-) or superior (+)
     * @example niivue.moveCrosshairInVox(1, 0, 0)
     * @see {@link https://niivue.github.io/niivue/features/draw2.html|live demo usage}
     */
    moveCrosshairInVox(x: number, y: number, z: number): void;
    frac2mm(frac: vec3, volIdx?: number, isForceSliceMM?: boolean): vec4;
    screenXY2TextureFrac(x: number, y: number, i: number, restrict0to1?: boolean): vec3;
    canvasPos2frac(canvasPos: number[]): vec3;
    scaleSlice(w: number, h: number, widthPadPixels?: number, heightPadPixels?: number): number[];
    drawThumbnail(): void;
    drawLine(startXYendXY: number[], thickness?: number, lineColor?: number[]): void;
    draw3DLine(startXY: vec2, endXYZ: vec3, thickness?: number, lineColor?: number[]): void;
    drawDottedLine(startXYendXY: number[], thickness?: number, lineColor?: number[]): void;
    drawGraphLine(LTRB: number[], color?: number[], thickness?: number): void;
    drawCrossLinesMM(sliceIndex: number, axCorSag: SLICE_TYPE, axiMM: number[], corMM: number[], sagMM: number[]): void;
    drawCrossLines(sliceIndex: number, axCorSag: SLICE_TYPE, axiMM: number[], corMM: number[], sagMM: number[]): void;
    /**
     * display a lightbox or montage view
     * @param mosaicStr - specifies orientation (A,C,S) and location of slices.
     * @example niivue.setSliceMosaicString("A -10 0 20");
     * @see {@link https://niivue.github.io/niivue/features/mosaics.html|live demo usage}
     */
    drawMosaic(mosaicStr: string): void;
    drawSceneCore(): string | void;
    drawScene(): string | void;
    get gl(): WebGL2RenderingContext;
    set gl(gl: WebGL2RenderingContext | null);
}

export { DEFAULT_OPTIONS, DRAG_MODE, type DocumentData, type ExportDocumentData, LabelLineTerminator, LabelTextAlignment, MULTIPLANAR_TYPE, NVController, NVDocument, NVImage, NVImageFromUrlOptions, NVLabel3D, NVLabel3DStyle, NVMesh, NVMeshFromUrlOptions, NVMeshLoaders, NVUtilities, Niivue, SLICE_TYPE, cmapper, ColorTables as colortables };
