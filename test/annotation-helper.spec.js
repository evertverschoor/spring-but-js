const AnnotationHelper = require('../src/annotation-helper');

let annotationHelper;

describe('lineIsAnnotation()', () => {

    beforeEach(() => {
        annotationHelper = new AnnotationHelper();
    });

    it('should approve well formatted registered annotations', () => {
        expect(annotationHelper.lineIsAnnotation('\'@Autowired\'')).toBe(true);
        expect(annotationHelper.lineIsAnnotation('\'@Aa\'')).toBe(true);
        expect(annotationHelper.lineIsAnnotation('\'@AVeryLongAnnotationName\'')).toBe(true);
    });

    it('should reject badly formatted annotations', () => {
        expect(annotationHelper.lineIsAnnotation('@Autowired\'')).toBe(false);
        expect(annotationHelper.lineIsAnnotation('\'@Autowired')).toBe(false);
        expect(annotationHelper.lineIsAnnotation('@Autowired')).toBe(false);

        expect(annotationHelper.lineIsAnnotation('\'Autowired\'')).toBe(false);
        expect(annotationHelper.lineIsAnnotation('\'Aut@owired\'')).toBe(false);
    });
});