import { useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ProjectList from "../components/ProjectList";
import WelcomeBand from "../components/WelcomeBand";
import CartSummary from "../components/CartSummary";
import { useLocation } from "react-router-dom";

function ProjectsPage(){
    const location = useLocation();
    const browseState = location.state?.browseState as
        | { selectedCategories?: string[]; pageNum?: number; pageSize?: number }
        | undefined;

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        browseState?.selectedCategories ?? []
    );
    const [pageNum, setPageNum] = useState<number>(browseState?.pageNum ?? 1);
    const [pageSize, setPageSize] = useState<number>(browseState?.pageSize ?? 5);

    return(
        <div className="container py-4">
        <WelcomeBand/>
      {/* Grid layout: sidebar on left, catalog on right */}
      <div className="row g-4 mt-1">
        <aside className="col-12 col-lg-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={(categories) => {
                setSelectedCategories(categories);
                setPageNum(1);
            }}
          />
          <CartSummary />
        </aside>

        <section className="col-12 col-lg-9">
          <ProjectList
            selectedCategories={selectedCategories}
            pageNum={pageNum}
            pageSize={pageSize}
            setPageNum={setPageNum}
            setPageSize={setPageSize}
          />
        </section>
      </div>
    </div>
    );
}

export default ProjectsPage;