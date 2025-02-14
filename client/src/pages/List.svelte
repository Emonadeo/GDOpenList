<script lang="ts">
	import { onMount } from 'svelte';
	import fzf from 'fuzzysort';
	import { getYoutubeIdFromUrl } from 'src/util';
	import type { Level } from 'src/generated/openapi';
	import { api } from 'src/api';

	let levels: Level[] = [];

	onMount(async () => {
		const res = await api.list.getList();

		if (!res.ok) {
			// TODO: Show Error
			return;
		}

		levels = res.data;
	});

	let search: string = '';
	let toggled: boolean = false;

	// TODO: clean up
	$: fLevels = search ? fzf.go(search, levels, { key: 'name' }).map((res) => res.obj) : levels;

	// TODO: clean up
	function toggle() {
		toggled = !toggled;
		if (!toggled) search = '';
	}
</script>

<div class="page-list">
	<aside>
		<div class="toggle" style:border-bottom={toggled ? null : 'none'}>
			<button on:click={toggle}>
				<img
					src={toggled ? 'src/assets/icons/close.svg' : 'src/assets/icons/filter.svg'}
					alt="Filter"
				/>
			</button>
		</div>
		<ul class="sections" role="list">
			<li>
				<a href="" class="type-label-lg">Main</a>
			</li>
			<li>
				<a href="" class="type-label-lg">Extended</a>
			</li>
		</ul>
		<div class="archive">
			<a href="" class="archive type-label-lg">Archive</a>
		</div>
	</aside>
	<main>
		<div class="search" style:display={toggled ? null : 'none'}>
			<input
				class="textfield type-label-lg"
				type="text"
				placeholder="Search"
				bind:value={search}
			/>
		</div>
		<p class="no-results" style:display={fLevels.length === 0 ? null : 'none'}>No results.</p>
		<ol role="list" class="levels">
			{#each fLevels as level}
				<li>
					<a href={`/list/${level.rank}`} class="level">
						<div class="rank">
							<h2 class:outline={level.rank < 100}>
								{Math.floor((level.rank / 100) % 10)}
							</h2>
							<h2 class:outline={level.rank < 10}>
								{Math.floor((level.rank / 10) % 10)}
							</h2>
							<h2>{Math.floor(level.rank % 10)}</h2>
						</div>
						<img
							class="thumbnail"
							src={`https://img.youtube.com/vi/${getYoutubeIdFromUrl(
								level.video
							)}/mqdefault.jpg`}
							alt="Thumbnail"
						/>
						<div class="meta">
							<h2>{level.name}</h2>
							<p>{level.user.name}</p>
						</div>
					</a>
				</li>
			{/each}
		</ol>
	</main>
</div>

<style lang="scss">
	@use 'src/styles/color';
	@use 'src/styles/screen';

	@include screen.xl {
		.page-list {
			overflow: hidden;
			flex: 1;
			display: grid;
			grid-template-columns: 4rem 1fr;
			grid-template-rows: minmax(0, 1fr);

			aside {
				display: grid;
				grid-template-rows: 4rem 1fr max-content;
				gap: 1.5rem;
				padding-bottom: 2rem;

				.toggle {
					border-bottom: 1px solid color.$surface;

					button {
						background-color: transparent;
						border: none;
						height: 100%;
						width: 100%;
						padding: 0;
						display: flex;
						align-items: center;
						justify-content: center;

						&:hover {
							background-color: color.$surface;
						}
					}
				}

				.sections {
					writing-mode: vertical-rl;
					display: flex;
					gap: 1rem;
					align-items: center;

					> li {
						display: flex;
						align-items: center;
						gap: 1rem;

						a {
							color: inherit;
						}
					}

					> li::after {
						content: '';
						height: 6rem;
						display: block;
						border-left: 1px solid white;
					}
				}

				.archive {
					display: flex;
					align-items: center;
					writing-mode: vertical-rl;
					color: inherit;
				}
			}

			main {
				overflow: auto;
				display: flex;
				flex-direction: column;

				.search {
					display: grid;
					grid-template-columns: calc(6rem + 4px) 1fr 1fr;
					align-items: center;
					column-gap: 2rem;
					height: 4rem;
					flex-shrink: 0;
					position: sticky;
					top: 0;
					padding-left: 2rem;
					background-color: color.$background;
					border-bottom: 1px solid color.$surface;

					.textfield {
						grid-column: 2;
					}
				}

				.no-results {
					margin-left: calc(10rem + 4px);
					margin-block: 2rem;
					color: color.$surface;
				}

				.levels {
					max-width: 64rem;

					.level {
						display: grid;
						grid-template-columns: max-content 12rem 1fr;
						gap: 2rem;
						color: inherit;
						padding: 2rem;
						border: 1px solid transparent;
						margin-bottom: -1px;

						&:hover {
							border-color: color.$on-background;
						}

						.rank {
							display: grid;
							grid-template-columns: 2rem 2rem 2rem;
							justify-items: center;
							gap: 2px;

							.outline {
								-webkit-text-stroke: 1px color.$on-background;
								color: transparent;
							}
						}

						.thumbnail {
							border-top: 1px solid color.$on-background;
							object-fit: cover;
						}

						.meta {
							display: flex;
							flex-direction: column;
							gap: 1.5rem;
						}
					}
				}
			}
		}
	}
</style>
