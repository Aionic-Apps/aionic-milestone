import React from 'react';

import Content from '../../components/UI/Content';
import Title from '../../components/UI/Title';

import CardDeck from '../../components/Deck';

import ProjectsWidgetbar from './components/Widgetbar';
import ProjectsFilters from './components/Filters';
import ProjectsCreate from './components/Create';

const SitesProjects = (props) => {
	const { projects, filters, filterProjectsByParams, filterProjectsByText, resetFilters } = props;
	const { all, fetched, filtered } = projects;

	const projectsToShow = filters.text.length ? filtered : fetched;

	return (
		<div className="SitesProjects">
			<Content>
				<Title title="Projects" />
				<ProjectsWidgetbar projects={all} />
				<div className="row">
					<div className="col-12 col-xl">
						<ProjectsFilters
							filters={filters}
							filterItemsByParams={filterProjectsByParams}
							filterItemsByText={filterProjectsByText}
							resetFilters={resetFilters}
						/>
					</div>
					<div className="col-12 col-xl-auto">
						<ProjectsCreate />
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<CardDeck deckType="project" itemList={projectsToShow} itemsPerRow={1} />
					</div>
				</div>
			</Content>
		</div>
	);
};

export default SitesProjects;
