export default function GuideBootStyle() {
    // Server-rendered guard: before any JS runs, force "no shift"
    // until the drawer explicitly opens and adds .guide-open to <html>.
    return (
      <>
        <script
          id="guide-boot-class-reset"
          dangerouslySetInnerHTML={{
            __html: 'try{document.documentElement.classList.remove("guide-open");}catch{}'
          }}
        />
        <style
          id="guide-boot"
          // Do NOT use attributes or :has() here.
          dangerouslySetInnerHTML={{
            __html:
              'html:not(.guide-open) [data-shiftable-root]{padding-right:0!important}'
          }}
        />
      </>
    );
  }