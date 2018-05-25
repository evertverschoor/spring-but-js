const AnnotationRegistry = require('../src/annotation-registry');

let annotationRegistry;

describe('lineIsAnnotation()', () => {

    beforeEach(() => {
        annotationRegistry = new AnnotationRegistry();
    });

    it('should approve well formatted registered annotations', () => {
        annotationRegistry.createAnnotation('Autowired', () => {});
        annotationRegistry.createAnnotation('Aa', () => {});
        annotationRegistry.createAnnotation('AVeryLongAnnotationName', () => {});

        expect(annotationRegistry.lineIsAnnotation('\'@Autowired\'')).toBe(true);
        expect(annotationRegistry.lineIsAnnotation('\'@Aa\'')).toBe(true);
        expect(annotationRegistry.lineIsAnnotation('\'@AVeryLongAnnotationName\'')).toBe(true);
    });

    it('should reject unregistered annotations', () => {
        expect(annotationRegistry.lineIsAnnotation('\'@Autowired\'')).toBe(false);
        expect(annotationRegistry.lineIsAnnotation('\'@Aa\'')).toBe(false);
        expect(annotationRegistry.lineIsAnnotation('\'@AVeryLongAnnotationName\'')).toBe(false);
    });

    it('should reject badly formatted but registered annotations', () => {
        annotationRegistry.createAnnotation('Autowired', () => {});

        expect(annotationRegistry.lineIsAnnotation('@Autowired\'')).toBe(false);
        expect(annotationRegistry.lineIsAnnotation('\'@Autowired')).toBe(false);
        expect(annotationRegistry.lineIsAnnotation('@Autowired')).toBe(false);

        expect(annotationRegistry.lineIsAnnotation('\'Autowired\'')).toBe(false);
        expect(annotationRegistry.lineIsAnnotation('\'Aut@owired\'')).toBe(false);
    });
});

describe('getActualAnnotationNameFromLine()', () => {

    beforeEach(() => {
        annotationRegistry = new AnnotationRegistry();
    });

    it('should return the actual annotation name in a variety of circumstances', () => {
        expect(annotationRegistry.getActualAnnotationNameFromLine('\'@Autowired\'')).toEqual('Autowired');
        expect(annotationRegistry.getActualAnnotationNameFromLine(' \'@Autowired\' ')).toEqual('Autowired');
        expect(annotationRegistry.getActualAnnotationNameFromLine('    \'@Autowired\'           ')).toEqual('Autowired');

        expect(annotationRegistry.getActualAnnotationNameFromLine('\'Autowired\'')).toEqual('Autowired');
    });
});