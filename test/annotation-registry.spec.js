const AnnotationRegistry = require('../src/annotation-registry');

let annotationRegistry;

describe('lineIsAnnotation()', () => {

    beforeEach(() => {
        annotationRegistry = new AnnotationRegistry(null, {
            lineIsAnnotation: () => true
        });
    });

    it('should approve registered annotations', () => {
        annotationRegistry.createAnnotation('Autowired', () => {});
        annotationRegistry.createAnnotation('Aa', () => {});
        annotationRegistry.createAnnotation('AVeryLongAnnotationName', () => {});

        expect(annotationRegistry.lineIsExistingAnnotation('\'@Autowired\'')).toBe(true);
        expect(annotationRegistry.lineIsExistingAnnotation('\'@Aa\'')).toBe(true);
        expect(annotationRegistry.lineIsExistingAnnotation('\'@AVeryLongAnnotationName\'')).toBe(true);
    });

    it('should reject unregistered annotations', () => {
        expect(annotationRegistry.lineIsExistingAnnotation('\'@Autowired\'')).toBe(false);
        expect(annotationRegistry.lineIsExistingAnnotation('\'@Aa\'')).toBe(false);
        expect(annotationRegistry.lineIsExistingAnnotation('\'@AVeryLongAnnotationName\'')).toBe(false);
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