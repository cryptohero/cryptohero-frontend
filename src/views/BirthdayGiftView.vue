<template>
	<div>
		<embed height="415"
		       width="544"
		       quality="high"
		       allowfullscreen="true"
		       type="application/x-shockwave-flash"
		       src="//static.hdslb.com/miniloader.swf"
		       flashvars="aid=11451633&page=1"
		       pluginspage="//www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash"></embed>

		<!-- https://ropsten.etherscan.io/address/0x1b5a1dae1b425445cfc2b3a00dd619ee6408b4f3#code -->
		<ol>
			<!-- <li>{{$t('Birthday Gift Value')}}：{{toDisplayedPrice(1)}}</li> -->
			<!-- <li>{{$t('Heroes Attack Value')}}：{{toDisplayedPrice(1)}}</li> -->
		</ol>
	</div>

</template>

<script>
import { buyItem, setGg, setNextPrice } from '@/api';
import { toReadablePrice } from '@/util';
</script>
